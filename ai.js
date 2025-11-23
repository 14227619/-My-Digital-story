// AI Chat Assistant Module
class AIAssistant {
    constructor() {
        this.chatBox = document.getElementById('chat-box');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.responses = this.getResponses();
        this.messageHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        this.init();
    }

    init() {
        this.loadMessageHistory();
        this.bindEvents();
    }

    bindEvents() {
        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });
    }

    getResponses() {
        return {
            "meet": "They met on LinkedIn! A Computer Science student and an IT student who connected over a shared passion for technology. Late-night chats about code and dreams laid the foundation for their story.",
            "dream": "He once had a beautiful dream that they were at the university's Green Belt. He rested his head in her lap and fell asleep. She watched over him, and even though it got dark and she was scared, she didn't wake him. It's a symbol of their care for each other.",
            "poem": "Here is a verse for you: 'Whatever our souls are made of, his and mine are the same.' - Emily Brontë",
            "story": "Their story began on LinkedIn and blossomed at Islamia University Bahawalpur, filled with shared projects, late-night study sessions, and a beautiful dream that symbolizes their connection.",
            "hello": "Hello! How can I help you learn more about their story?",
            "hi": "Hi there! Feel free to ask me anything about their journey.",
            "default": "That's a lovely thought! I can tell you about how they met, about a special dream, or share a poem. What would you like to know?"
        };
    }

    async handleSendMessage() {
        const userText = this.userInput.value.trim();
        if (!userText) return;

        this.addMessage(userText, 'user');
        this.userInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Try to get AI response from backend first
            const aiResponse = await this.getAIResponse(userText);
            this.hideTypingIndicator();
            this.addMessage(aiResponse, 'ai');
        } catch (error) {
            console.warn('AI service unavailable, using fallback:', error);
            // Fallback to local responses
            this.hideTypingIndicator();
            const fallbackResponse = this.getFallbackResponse(userText);
            this.addMessage(fallbackResponse, 'ai');
        }
    }

    async getAIResponse(question) {
        const storyContext = document.getElementById('story').innerText;

        const response = await fetch('/.netlify/functions/ask-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                storyContext: storyContext
            })
        });

        if (!response.ok) {
            throw new Error('AI service failed');
        }

        const data = await response.json();
        return data.answer || "Sorry, I couldn't get a response. Please try again.";
    }

    getFallbackResponse(input) {
        const lowerInput = input.toLowerCase();
        for (const keyword in this.responses) {
            if (lowerInput.includes(keyword)) {
                return this.responses[keyword];
            }
        }
        return this.responses.default;
    }

    addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        const p = document.createElement('p');
        p.textContent = text;
        messageElement.appendChild(p);
        this.chatBox.appendChild(messageElement);

        // Scroll to latest message
        this.chatBox.scrollTop = this.chatBox.scrollHeight;

        // Save to history
        this.messageHistory.push({ text, sender, timestamp: Date.now() });
        this.saveMessageHistory();
    }

    showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'ai-message', 'typing');
        typingElement.innerHTML = '<p><span class="typing-dots">Typing<span>.</span><span>.</span><span>.</span></span></p>';
        typingElement.id = 'typing-indicator';
        this.chatBox.appendChild(typingElement);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    hideTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    saveMessageHistory() {
        // Keep only last 50 messages
        if (this.messageHistory.length > 50) {
            this.messageHistory = this.messageHistory.slice(-50);
        }
        localStorage.setItem('chatHistory', JSON.stringify(this.messageHistory));
    }

    loadMessageHistory() {
        // Load last 10 messages on page load
        const recentMessages = this.messageHistory.slice(-10);
        recentMessages.forEach(msg => {
            this.addMessageToDOM(msg.text, msg.sender);
        });
    }

    addMessageToDOM(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        const p = document.createElement('p');
        p.textContent = text;
        messageElement.appendChild(p);
        this.chatBox.appendChild(messageElement);
    }
}

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
});