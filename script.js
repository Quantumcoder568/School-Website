// Enhanced AI Chatbot Functionality
function initEnhancedChatbot() {
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMinimize = document.querySelector('.chatbot-minimize');
    const sendMessageBtn = document.getElementById('sendMessage');
    const voiceInputBtn = document.getElementById('voiceInput');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const quickQuestions = document.querySelectorAll('.quick-question');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    const typingIndicator = document.querySelector('.typing-indicator');
    const notificationDot = document.querySelector('.notification-dot');

    let conversationHistory = [];
    let isTyping = false;
    let messageCount = 0;

    // Enhanced AI responses with personality
    const aiResponses = {
        'greeting': [
            "Hello there! I'm Wisdom, your AI assistant at Royal Wisdom High School. It's wonderful to meet you! How can I help you explore our amazing school today? 🌟",
            "Hi! I'm Wisdom, your friendly guide to Royal Wisdom High School. I'm excited to help you discover everything our school has to offer! What would you like to know? 😊",
            "Welcome! I'm Wisdom, here to assist you with all things Royal Wisdom. Whether it's admissions, programs, or campus life - I've got you covered! How can I help? 📚"
        ],
        'admissions': [
            "Our admissions process is designed to find students who will thrive in our community! It involves 4 key steps:\n\n1️⃣ **Application & Documents** - Submit your application with transcripts and recommendations\n2️⃣ **Entrance Assessment** - Show us your academic potential\n3️⃣ **Family Interview** - Let's get to know each other better\n4️⃣ **Acceptance & Welcome** - Join our Royal Wisdom family!\n\nWould you like me to elaborate on any specific step?",
            "I'd be happy to walk you through our admissions journey! We look for curious, motivated students who want to make a difference. The process includes application review, assessments, and a friendly interview. Our team is here to support you every step of the way!",
            "The path to becoming a Royal Wisdom student is an exciting adventure! We consider academic potential, character, and how students might contribute to our community. The process typically takes 4-6 weeks from application to decision."
        ],
        'programs': [
            "We offer diverse programs to nurture every student's talents! 🎓\n\n**STEM Program**: Advanced science, robotics, and innovation labs\n**Humanities**: Deep dives into literature, history, and critical thinking\n**IB Diploma**: Globally recognized curriculum with international focus\n**Arts & Athletics**: Comprehensive creative and sports programs\n\nWhich area sparks your interest? I can share more details!",
            "Our academic programs are designed to challenge and inspire! From cutting-edge STEM labs to award-winning arts programs, we help students discover their passions. Many students combine interests across different disciplines - the possibilities are endless!",
            "At Royal Wisdom, learning goes beyond the classroom! We offer specialized programs in STEM, humanities, international studies, arts, and athletics. Each program includes hands-on projects, expert faculty, and real-world applications."
        ],
        'tuition': [
            "Investing in education is important! Here's our fee structure:\n\n💵 **Annual Tuition**: $25,000\n📝 **Application Fee**: $100 (one-time)\n🎯 **Enrollment Fee**: $500 (one-time)\n💻 **Technology Fee**: $300/year\n🏀 **Activity Fee**: $200/year\n\nWe believe money shouldn't be a barrier to quality education! We offer:\n• Merit-based scholarships\n• Need-based financial aid\n• Payment plans\n• Sibling discounts\n\nWould you like to explore financial assistance options?",
            "Education is an investment in the future! Our comprehensive fee covers world-class facilities, expert teachers, and abundant resources. We're committed to making Royal Wisdom accessible through various financial aid programs and scholarships.",
            "Our tuition reflects the exceptional education and resources we provide. The good news? Over 30% of our students receive some form of financial support! We work with families to make education affordable through scholarships and flexible payment options."
        ],
        'campus': [
            "Our campus is like a second home! 🏫\n\n• **State-of-the-art classrooms** with smart technology\n• **Science & innovation labs** that inspire discovery\n• **Performing arts center** for creative expression\n• **Athletic complex** with pool and multiple courts\n• **Beautiful green spaces** for relaxation and study\n• **Modern library** with 20,000+ resources\n\nIt's a vibrant community where learning happens everywhere!",
            "Walking through our campus feels like entering a world of possibilities! We have specialized learning spaces, collaborative areas, and plenty of room to grow. From our innovation hub to our peaceful gardens, every space is designed to inspire.",
            "Our 25-acre campus is a learning environment like no other! We blend historic architecture with modern facilities, creating spaces that stimulate both mind and spirit. Students love our community atmosphere and the endless opportunities to explore new interests."
        ],
        'default': [
            "That's an interesting question! While I specialize in Royal Wisdom information, I'd love to help you with school-related topics. You could ask me about:\n\n🎓 Admissions process and deadlines\n📚 Academic programs and courses\n💰 Tuition and financial aid\n🏫 Campus facilities and life\n👥 Student activities and clubs\n📞 Contact information\n\nWhat would you like to explore?",
            "Hmm, I'm not sure I have the perfect answer for that in my knowledge base. I'm here to help you learn all about Royal Wisdom High School - from admissions to campus life! What school-related topic can I assist with?",
            "I'm constantly learning, but that specific question is outside my current expertise. I'm your go-to source for everything Royal Wisdom! Try asking about our programs, admissions, or student experience. I'm here to help! 😊"
        ]
    };

    // Conversation flow and context
    const conversationFlow = {
        'current_topic': null,
        'user_name': null,
        'user_interest': null,
        'previous_questions': []
    };

    // Initialize chatbot
    function init() {
        setupEventListeners();
        showWelcomeNotification();
    }

    function setupEventListeners() {
        chatbotToggle.addEventListener('click', toggleChatbot);
        chatbotClose.addEventListener('click', closeChatbot);
        chatbotMinimize.addEventListener('click', minimizeChatbot);
        sendMessageBtn.addEventListener('click', sendMessage);
        voiceInputBtn.addEventListener('click', toggleVoiceInput);
        
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        chatbotInput.addEventListener('input', handleInputChange);

        quickQuestions.forEach(button => {
            button.addEventListener('click', () => {
                const question = button.getAttribute('data-question');
                handleQuickQuestion(question);
            });
        });

        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.getAttribute('data-question');
                handleQuickQuestion(question);
            });
        });

        // Auto-open after delay
        setTimeout(() => {
            if (!chatbotContainer.classList.contains('active')) {
                showNotification("I'm here to help! 🎓");
            }
        }, 15000);
    }

    function toggleChatbot() {
        chatbotContainer.classList.toggle('active');
        notificationDot.style.display = 'none';
        
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    }

    function closeChatbot() {
        chatbotContainer.classList.remove('active');
    }

    function minimizeChatbot() {
        chatbotContainer.classList.toggle('minimized');
    }

    function handleInputChange() {
        // Auto-resize input
        chatbotInput.style.height = 'auto';
        chatbotInput.style.height = Math.min(chatbotInput.scrollHeight, 100) + 'px';
    }

    function handleQuickQuestion(question) {
        addMessage(question, 'user');
        processMessage(question);
    }

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message && !isTyping) {
            addMessage(message, 'user');
            chatbotInput.value = '';
            chatbotInput.style.height = 'auto';
            processMessage(message);
        }
    }

    async function processMessage(message) {
        messageCount++;
        conversationHistory.push({ role: 'user', content: message });
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate AI processing time (1-3 seconds)
        const processingTime = 1000 + Math.random() * 2000;
        
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateAIResponse(message);
            addMessage(response, 'bot');
            updateConversationFlow(message, response);
            updateSuggestions();
        }, processingTime);
    }

    function generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Analyze message intent
        if (lowerMessage.match(/(hi|hello|hey|good morning|good afternoon)/)) {
            return getRandomResponse('greeting');
        } else if (lowerMessage.match(/(admission|apply|application|enroll|deadline)/)) {
            conversationFlow.current_topic = 'admissions';
            return getRandomResponse('admissions');
        } else if (lowerMessage.match(/(program|course|curriculum|study|major|subject)/)) {
            conversationFlow.current_topic = 'programs';
            return getRandomResponse('programs');
        } else if (lowerMessage.match(/(tuition|fee|cost|price|financial|scholarship|aid|money)/)) {
            conversationFlow.current_topic = 'tuition';
            return getRandomResponse('tuition');
        } else if (lowerMessage.match(/(campus|facility|building|dorm|library|lab|sport)/)) {
            conversationFlow.current_topic = 'campus';
            return getRandomResponse('campus');
        } else {
            return getRandomResponse('default');
        }
    }

    function getRandomResponse(category) {
        const responses = aiResponses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function updateConversationFlow(userMessage, botResponse) {
        conversationFlow.previous_questions.push(userMessage);
        
        // Keep only last 5 questions
        if (conversationFlow.previous_questions.length > 5) {
            conversationFlow.previous_questions.shift();
        }
        
        conversationHistory.push({ role: 'assistant', content: botResponse });
    }

    function updateSuggestions() {
        // Update suggestion chips based on conversation context
        const suggestionsContainer = document.querySelector('.suggestion-chips');
        const contextSuggestions = getContextualSuggestions();
        
        suggestionsContainer.innerHTML = contextSuggestions.map(suggestion => 
            `<button class="suggestion-chip" data-question="${suggestion.question}">${suggestion.text}</button>`
        ).join('');
        
        // Re-attach event listeners
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.getAttribute('data-question');
                handleQuickQuestion(question);
            });
        });
    }

    function getContextualSuggestions() {
        const baseSuggestions = [
            { question: "What's the application deadline?", text: "Application Deadline" },
            { question: "Do you offer scholarships?", text: "Scholarship Info" },
            { question: "What sports are available?", text: "Sports Programs" }
        ];
        
        if (conversationFlow.current_topic === 'admissions') {
            return [
                { question: "What documents are required?", text: "Required Documents" },
                { question: "When are the entrance exams?", text: "Exam Dates" },
                { question: "What is the interview process?", text: "Interview Info" }
            ];
        } else if (conversationFlow.current_topic === 'programs') {
            return [
                { question: "Tell me about STEM courses", text: "STEM Details" },
                { question: "What arts programs are available?", text: "Arts Programs" },
                { question: "Do you have AP courses?", text: "AP Courses" }
            ];
        }
        
        return baseSuggestions;
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        // Format text with line breaks
        const formattedText = text.replace(/\n/g, '<br>');
        content.innerHTML = `<p>${formattedText}</p>`;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = getCurrentTime();
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messageDiv.appendChild(time);
        
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        isTyping = true;
        typingIndicator.classList.add('active');
        sendMessageBtn.disabled = true;
        scrollToBottom();
    }

    function hideTypingIndicator() {
        isTyping = false;
        typingIndicator.classList.remove('active');
        sendMessageBtn.disabled = false;
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function showWelcomeNotification() {
        setTimeout(() => {
            showNotification("Need help? I'm here! 💫");
        }, 5000);
    }

    function showNotification(message) {
        if (!chatbotContainer.classList.contains('active')) {
            notificationDot.style.display = 'block';
            
            // Create browser notification if permitted
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Royal Wisdom Assistant", {
                    body: message,
                    icon: "/favicon.ico"
                });
            }
        }
    }

    function toggleVoiceInput() {
        if (!('webkitSpeechRecognition' in window)) {
            addMessage("Sorry, voice input isn't supported in your browser. Please type your message instead.", 'bot');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.start();
        voiceInputBtn.innerHTML = '<i class="fas fa-circle"></i>';
        voiceInputBtn.style.color = '#ff4757';
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatbotInput.value = transcript;
            voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceInputBtn.style.color = '';
        };
        
        recognition.onerror = () => {
            voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceInputBtn.style.color = '';
        };
        
        recognition.onend = () => {
            voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceInputBtn.style.color = '';
        };
    }

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }

    // Initialize the chatbot
    init();
}

// Initialize enhanced chatbot
document.addEventListener('DOMContentLoaded', initEnhancedChatbot);


// FAQ Functionality for Admissions Section
function initAdmissionsFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize admissions FAQ when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdmissionsFAQ);

// Admissions CTA Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const startAppBtn = document.getElementById('startApplication');
    const scheduleTourBtn = document.getElementById('scheduleTour');
    const downloadBrochureBtn = document.getElementById('downloadBrochure');
    
    if (startAppBtn) {
        startAppBtn.addEventListener('click', function() {
            alert('Application form would open here. In a real implementation, this would redirect to the application portal.');
        });
    }
    
    if (scheduleTourBtn) {
        scheduleTourBtn.addEventListener('click', function() {
            alert('Tour scheduling modal would open here. You can integrate a calendar booking system.');
        });
    }
    
    if (downloadBrochureBtn) {
        downloadBrochureBtn.addEventListener('click', function() {
            alert('Brochure download would start here. You can link to a PDF file.');
        });
    }
});






        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });

        // Check for saved theme preference
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }

        // Header Scroll Effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Slideshow Functionality
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slide-dot');
        let currentSlide = 0;
        const slideInterval = 5000; // 5 seconds

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        // Set up automatic slideshow
        let slideTimer = setInterval(nextSlide, slideInterval);

        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideTimer);
                showSlide(index);
                slideTimer = setInterval(nextSlide, slideInterval);
            });
        });

        // Parent Portal Modal
        const portalModal = document.getElementById('portalModal');
        const parentPortalBtn = document.getElementById('parentPortalBtn');
        const viewSampleReport = document.getElementById('viewSampleReport');
        const closeModal = document.getElementById('closeModal');
        
        function openModal() {
            portalModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            resetForm();
        }
        
        function closeModalFunc() {
            portalModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        parentPortalBtn.addEventListener('click', openModal);
        viewSampleReport.addEventListener('click', openModal);
        closeModal.addEventListener('click', closeModalFunc);
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === portalModal) {
                closeModalFunc();
            }
        });

  // Get Access Modal Functionality
const getAccessModal = document.getElementById('getAccessModal');
const closeAccessModal = document.getElementById('closeAccessModal');
const getAccessForm = document.getElementById('getAccessForm');

function openGetAccessModal() {
    getAccessModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    resetAccessForm();
}

function closeGetAccessModal() {
    getAccessModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Multi-step form functionality for get access
const accessSteps = document.querySelectorAll('#getAccessModal .step');
const accessFormSteps = document.querySelectorAll('#getAccessModal .form-step');
const nextAccessButtons = document.querySelectorAll('.next-access-step');
const prevAccessButtons = document.querySelectorAll('.prev-access-step');

function goToAccessStep(stepNumber) {
    // Update steps
    accessSteps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    for (let i = 0; i < stepNumber; i++) {
        accessSteps[i].classList.add('completed');
    }
    
    accessSteps[stepNumber - 1].classList.add('active');
    
    // Update form steps
    accessFormSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    document.getElementById(`accessFormStep${stepNumber}`).classList.add('active');
}

nextAccessButtons.forEach(button => {
    button.addEventListener('click', () => {
        const currentStep = parseInt(button.closest('.form-step').id.replace('accessFormStep', ''));
        const nextStep = parseInt(button.getAttribute('data-next'));
        
        // Validate current step before proceeding
        if (validateAccessStep(currentStep)) {
            goToAccessStep(nextStep);
        }
    });
});

prevAccessButtons.forEach(button => {
    button.addEventListener('click', () => {
        const prevStep = parseInt(button.getAttribute('data-prev'));
        goToAccessStep(prevStep);
    });
});

function validateAccessStep(stepNumber) {
    const currentStep = document.getElementById(`accessFormStep${stepNumber}`);
    const inputs = currentStep.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#f44336';
        } else {
            input.style.borderColor = '';
        }
    });

    // Additional validation for step 3 (password)
    if (stepNumber === 3) {
        const password = document.getElementById('createPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        if (password.length < 8) {
            showAccessStatus('Password must be at least 8 characters long', 'error');
            isValid = false;
        } else if (password !== confirmPassword) {
            showAccessStatus('Passwords do not match', 'error');
            isValid = false;
        } else if (!agreeTerms) {
            showAccessStatus('Please agree to the terms and conditions', 'error');
            isValid = false;
        }
    }

    if (!isValid) {
        showAccessStatus('Please fill in all required fields correctly', 'error');
    }

    return isValid;
}

function showAccessStatus(message, type) {
    const statusDiv = document.getElementById('accessStatus');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

function resetAccessForm() {
    getAccessForm.reset();
    goToAccessStep(1);
    document.getElementById('accessStatus').style.display = 'none';
    
    // Reset border colors
    const inputs = getAccessForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// Form submission
getAccessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateAccessStep(3)) {
        // Simulate account creation process
        showAccessStatus('Verifying information and creating your account...', 'info');
        
        // Simulate API call delay
        setTimeout(() => {
            const wardName = document.getElementById('wardFullName').value;
            const parentName = document.getElementById('parentFullName').value;
            const parentEmail = document.getElementById('parentEmailAccess').value;
            
            // In real implementation, this would send data to server
            // For demo purposes, we'll simulate successful account creation
            
            showAccessStatus(`✅ Account created successfully! Welcome ${parentName}. An email has been sent to ${parentEmail} with login instructions.`, 'success');
            
            // Auto-close after success
            setTimeout(() => {
                closeGetAccessModal();
                // Auto-fill the login form with the new credentials
                document.getElementById('parentEmail').value = parentEmail;
                document.getElementById('parentPassword').value = document.getElementById('createPassword').value;
                
                alert(`Account for ${parentName} (parent of ${wardName}) has been created successfully! You can now login with your credentials.`);
            }, 3000);
        }, 2000);
    }
});

// Event listeners for get access modal
document.addEventListener('DOMContentLoaded', function() {
    // Find and set up the request access link
    const requestAccessLink = document.getElementById('requestAccessLink');
    if (requestAccessLink) {
        requestAccessLink.addEventListener('click', function(e) {
            e.preventDefault();
            openGetAccessModal();
        });
    }
});

closeAccessModal.addEventListener('click', closeGetAccessModal);
window.addEventListener('click', (e) => {
    if (e.target === getAccessModal) {
        closeGetAccessModal();
    }
});

        // Mobile Menu Toggle
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenu.addEventListener('click', () => {
            // Only toggle on mobile screens
            if (window.innerWidth <= 992) {
                if (navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                } else {
                    navLinks.style.display = 'flex';
                }
            }
        });

        // Reset navigation on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                // Completely reset all inline styles
                navLinks.style.display = '';
                navLinks.style.flexDirection = '';
                navLinks.style.position = '';
                navLinks.style.top = '';
                navLinks.style.left = '';
                navLinks.style.width = '';
                navLinks.style.background = '';
                navLinks.style.backdropFilter = '';
                navLinks.style.padding = '';
                navLinks.style.gap = '';
                navLinks.style.borderTop = '';
                navLinks.style.borderBottom = '';
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open - ONLY on mobile
                    if (window.innerWidth <= 992) {
                        navLinks.style.display = 'none';
                    }
                }
            });
        });

        // Multi-step Form Functionality
        const steps = document.querySelectorAll('.step');
        const formSteps = document.querySelectorAll('.form-step');
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        const studentReportForm = document.getElementById('studentReportForm');
        const generatedReport = document.getElementById('generatedReport');
        const printReportBtn = document.getElementById('printReport');

        function goToStep(stepNumber) {
            // Update steps
            steps.forEach(step => {
                step.classList.remove('active', 'completed');
            });
            
            for (let i = 0; i < stepNumber; i++) {
                steps[i].classList.add('completed');
            }
            
            steps[stepNumber - 1].classList.add('active');
            
            // Update form steps
            formSteps.forEach(step => {
                step.classList.remove('active');
            });
            
            document.getElementById(`formStep${stepNumber}`).classList.add('active');
        }

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const nextStep = parseInt(button.getAttribute('data-next'));
                goToStep(nextStep);
                
                // If going to the final step, generate the report
                if (nextStep === 3) {
                    generateReport();
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                const prevStep = parseInt(button.getAttribute('data-prev'));
                goToStep(prevStep);
            });
        });

        function resetForm() {
            studentReportForm.reset();
            goToStep(1);
        }

        function generateReport() {
            const studentName = document.getElementById('studentName').value || 'Emily Johnson';
            const studentGrade = document.getElementById('studentGrade').value || '10';
            const studentId = document.getElementById('studentId').value || 'RW2023157';
            const studentDescription = document.getElementById('studentDescription').value || 'A diligent student who shows great potential in science and mathematics.';
            const academicProgram = document.getElementById('academicProgram').value || 'stem';
            const currentTerm = document.getElementById('currentTerm').value || '2';
            const academicYear = document.getElementById('academicYear').value || '2023-2024';
            const parentConcerns = document.getElementById('parentConcerns').value || 'None at this time.';

            const programNames = {
                'stem': 'STEM Program',
                'humanities': 'Humanities',
                'ib': 'International Baccalaureate'
            };

            const termNames = {
                '1': 'First Term',
                '2': 'Second Term',
                '3': 'Third Term'
            };

            const reportHTML = `
                <div class="report-card">
                    <div class="student-info">
                        <div>
                            <h3>${studentName}</h3>
                            <p>Grade ${studentGrade} | Student ID: ${studentId}</p>
                            <p><strong>Program:</strong> ${programNames[academicProgram]}</p>
                        </div>
                        <div>
                            <p><strong>Academic Year:</strong> ${academicYear}</p>
                            <p><strong>Term:</strong> ${termNames[currentTerm]}</p>
                            <p><strong>Attendance:</strong> 96%</p>
                        </div>
                    </div>
                    
                    <div class="summary">
                        <h4>Student Description</h4>
                        <p>${studentDescription}</p>
                        <p><strong>Parent Notes:</strong> ${parentConcerns}</p>
                    </div>
                    
                    <h4>Academic Performance</h4>
                    <div class="performance-chart">
                        <div class="chart-label">
                            <span>Subject</span>
                            <span>Grade</span>
                        </div>
                        <div class="chart-bar" style="width: 95%">
                            <span>Mathematics - A (95%)</span>
                        </div>
                        <div class="chart-bar" style="width: 90%">
                            <span>English Literature - A- (90%)</span>
                        </div>
                        <div class="chart-bar" style="width: 87%">
                            <span>Chemistry - B+ (87%)</span>
                        </div>
                        <div class="chart-bar" style="width: 92%">
                            <span>World History - A (92%)</span>
                        </div>
                        <div class="chart-bar" style="width: 88%">
                            <span>Spanish - B+ (88%)</span>
                        </div>
                    </div>
                    
                    <table class="grades-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Teacher</th>
                                <th>Grade</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mathematics</td>
                                <td>Mr. Roberts</td>
                                <td>A</td>
                                <td>Excellent problem-solving skills</td>
                            </tr>
                            <tr>
                                <td>English Literature</td>
                                <td>Ms. Patterson</td>
                                <td>A-</td>
                                <td>Strong analytical writing</td>
                            </tr>
                            <tr>
                                <td>Chemistry</td>
                                <td>Dr. Miller</td>
                                <td>B+</td>
                                <td>Good lab work, needs improvement on theory</td>
                            </tr>
                            <tr>
                                <td>World History</td>
                                <td>Mr. Gonzalez</td>
                                <td>A</td>
                                <td>Exceptional research project</td>
                            </tr>
                            <tr>
                                <td>Spanish</td>
                                <td>Señora Rodriguez</td>
                                <td>B+</td>
                                <td>Good conversational skills</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="teacher-comments">
                        <h4>Teacher Comments</h4>
                        <p><strong>Overall Performance:</strong> ${studentName} is a diligent student who participates actively in class discussions. ${studentName.split(' ')[0]} has shown significant improvement in Chemistry this term. We encourage ${studentName.split(' ')[0]} to continue ${studentName.split(' ')[0].endsWith('s') ? '' : 's'} excellent work.</p>
                        <p><strong>Recommendations:</strong> Consider joining the Science Club to further develop laboratory skills. Would benefit from additional practice with Spanish verb conjugations.</p>
                    </div>
                    
                    <div class="summary">
                        <h4>Overall Performance Summary</h4>
                        <p><strong>GPA:</strong> 3.75</p>
                        <p><strong>Class Rank:</strong> 15/120</p>
                        <p><strong>Attendance Rate:</strong> 96%</p>
                        <p><strong>Extracurricular Participation:</strong> Science Club, Debate Team</p>
                    </div>
                </div>
            `;

            generatedReport.innerHTML = reportHTML;

            // Animate the chart bars
            setTimeout(() => {
                document.querySelectorAll('.chart-bar').forEach(bar => {
                    bar.style.width = bar.style.width;
                });
            }, 100);
        }

        printReportBtn.addEventListener('click', () => {
            alert('In a real implementation, this would open a print dialog for the report. For this demo, the report is displayed on screen.');
        });

        // Initialize the form
        resetForm();

        // Parent Login Form
const parentLoginForm = document.getElementById('parentLoginForm');

parentLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('parentEmail').value;
    const password = document.getElementById('parentPassword').value;
    
    // Basic validation
    if (email && password) {
        // Simulate login - in real implementation, this would authenticate with server
        localStorage.setItem('parentLoggedIn', 'true');
        localStorage.setItem('parentEmail', email);
        window.location.href = 'parent-portal.html';
    } else {
        alert('Please enter both email and password.');
    }
});

// Forgot Password Modal Functionality
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeForgotPasswordModal = document.getElementById('closeForgotPasswordModal');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const backToLoginBtn = document.getElementById('backToLogin');

function openForgotPasswordModal() {
    forgotPasswordModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    resetForgotPasswordForm();
}

function closeForgotPasswordModalFunc() {
    forgotPasswordModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function resetForgotPasswordForm() {
    forgotPasswordForm.reset();
    document.getElementById('passwordRecoveryStatus').style.display = 'none';
}

function showPasswordRecoveryStatus(message, type) {
    const statusDiv = document.getElementById('passwordRecoveryStatus');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
}

// Event listeners for forgot password modal
document.addEventListener('DOMContentLoaded', function() {
    // Find and set up the forgot password link
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeModalFunc(); // Close parent portal modal if open
            openForgotPasswordModal();
        });
    }
});

// Forgot password form submission
forgotPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('recoveryEmail').value;
    
    if (!email) {
        showPasswordRecoveryStatus('Please enter your email address', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showPasswordRecoveryStatus('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate sending reset instructions
    showPasswordRecoveryStatus('Sending reset instructions to your email...', 'info');
    
    // Simulate API call delay
    setTimeout(() => {
        // In real implementation, this would send a reset link to the user's email
        // For demo purposes, we'll simulate successful email sending
        
        showPasswordRecoveryStatus(`✅ Password reset instructions have been sent to ${email}. Please check your inbox and follow the link to reset your password.`, 'success');
        
        // Auto-close after success
        setTimeout(() => {
            closeForgotPasswordModalFunc();
            alert(`Password reset instructions sent to ${email}. Please check your email to complete the process.`);
        }, 4000);
    }, 2000);
});

// Back to login button
backToLoginBtn.addEventListener('click', function() {
    closeForgotPasswordModalFunc();
    // Optionally open the parent portal modal
    // openModal();
});

// Close modal events
closeForgotPasswordModal.addEventListener('click', closeForgotPasswordModalFunc);
window.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) {
        closeForgotPasswordModalFunc();
    }
});

// Update the request access link setup in your existing code
document.addEventListener('DOMContentLoaded', function() {
    // Set up request access link
    const requestAccessLink = document.getElementById('requestAccessLink');
    if (requestAccessLink) {
        requestAccessLink.addEventListener('click', function(e) {
            e.preventDefault();
            openGetAccessModal();
        });
    }
    
    // Set up forgot password link (this might already be in your code)
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeModalFunc(); // Close parent portal modal if open
            openForgotPasswordModal();
        });
    }
});

// Student Life Slider Functionality
function initStudentLifeSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;
    const slideInterval = 4000; // 4 seconds

    function updateSlider() {
        // Update track position
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        clearInterval(autoSlide);
        nextSlide();
        autoSlide = setInterval(nextSlide, slideInterval);
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(autoSlide);
        prevSlide();
        autoSlide = setInterval(nextSlide, slideInterval);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoSlide);
            goToSlide(index);
            autoSlide = setInterval(nextSlide, slideInterval);
        });
    });

    // Auto-slide
    let autoSlide = setInterval(nextSlide, slideInterval);

    // Pause on hover
    const sliderContainer = document.querySelector('.student-life-slider');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, slideInterval);
    });

    // Initialize
    updateSlider();
}

// Initialize the slider when DOM is loaded
document.addEventListener('DOMContentLoaded', initStudentLifeSlider);

