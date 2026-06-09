document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       MOBILE NAVIGATION TOGGLE
       ========================================== */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('open');
        });

        // Close mobile nav when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('open');
            });
        });
    }

    /* ==========================================
       TAB SELECTION (USE CASES)
       ========================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Set button state
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set pane state with fade
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === targetTab) {
                    pane.classList.add('active');
                }
            });
        });
    });

    /* ==========================================
       INTERACTIVE ROI CALCULATOR
       ========================================== */
    const hoursSlider = document.getElementById('hours-slider');
    const rateSlider = document.getElementById('rate-slider');
    const agentsSlider = document.getElementById('agents-slider');

    const hoursVal = document.getElementById('hours-val');
    const rateVal = document.getElementById('rate-val');
    const agentsVal = document.getElementById('agents-val');

    const savingsAmount = document.getElementById('savings-amount');
    const hoursSaved = document.getElementById('hours-saved');

    function calculateROI() {
        const hours = parseFloat(hoursSlider.value);
        const rate = parseFloat(rateSlider.value);
        const agents = parseFloat(agentsSlider.value);

        // Update slider labels
        hoursVal.textContent = hours;
        rateVal.textContent = `$${rate}`;
        agentsVal.textContent = agents;

        // Math:
        // Total weekly manual hours = hours * agents
        // Total monthly manual hours = total weekly * 4.33 (average weeks per month)
        // Total monthly manual cost = total monthly hours * rate
        // We project AI automates 75% of these manual hours
        const weeklyHours = hours * agents;
        const monthlyHours = weeklyHours * 4.33;
        const monthlyCost = monthlyHours * rate;

        const projectedSavings = monthlyCost * 0.75;
        const projectedHoursReclaimed = monthlyHours * 0.75;

        // Display results
        savingsAmount.textContent = `$${Math.round(projectedSavings).toLocaleString()}`;
        hoursSaved.textContent = `${Math.round(projectedHoursReclaimed)} hrs`;
    }

    if (hoursSlider && rateSlider && agentsSlider) {
        hoursSlider.addEventListener('input', calculateROI);
        rateSlider.addEventListener('input', calculateROI);
        agentsSlider.addEventListener('input', calculateROI);
        
        // Initial Calculation
        calculateROI();
    }

    /* ==========================================
       ACCORDION FAQS
       ========================================== */
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const content = trigger.nextElementSibling;
            const isOpen = item.classList.contains('active');

            // Close all items first for accordion effect
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-content').style.maxHeight = null;
                i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            });

            // If it wasn't open, open it
            if (!isOpen) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ==========================================
       DYNAMIC AI AGENT CHAT SIMULATOR
       ========================================== */
    const chatArea = document.getElementById('sim-chat-area');
    const runBtn = document.getElementById('sim-run-btn');

    const simulationScenarios = [
        // Scenario 1: Real Estate
        [
            { type: 'user', text: "Can you help lead 'Mukesh Kumar' book a property viewing for 1024 Bluebird Lane?" },
            { type: 'system', text: ">> Initializing LeadQualificationAgent... [Model: Gemini-1.5-Pro]" },
            { type: 'agent', name: "Real Estate Agent", text: "Scanning CRM contact records. Found 'Mukesh Kumar'. Contacting MLS API to pull calendar slots for 1024 Bluebird Lane..." },
            { type: 'system', text: ">> MLS Database Query: SUCCESS. Found available slots: June 10 (2:00 PM, 4:00 PM)." },
            { type: 'agent', name: "Real Estate Agent", text: "Hi Mukesh, I've located 1024 Bluebird Lane. We have slots open tomorrow, June 10, at 2 PM and 4 PM. Which works best?" },
            { type: 'user', text: "Let's do 2 PM. Also update my CRM budget to $900k." },
            { type: 'system', text: ">> Processing user response... Updating HubSpot CRM... Scheduling viewing via Cal.com API..." },
            { type: 'agent', name: "Real Estate Agent", text: "Perfect! I have booked your viewing for June 10 at 2:00 PM EST. Confirmation email sent. I have also updated your budget preference to $900,000 in your contact profile. See you tomorrow!" },
            { type: 'system', text: ">> Task execution complete. Google Calendar slot locked. Status: IDLE." }
        ],
        // Scenario 2: Construction
        [
            { type: 'user', text: "Generate concrete estimate for blueprints under RFQ-9812." },
            { type: 'system', text: ">> Initializing QuoteEstimationAgent... Reading file 'blueprint_9812.pdf'..." },
            { type: 'agent', name: "Construction Agent", text: "Blueprints loaded. Extracting foundation measurements... Concrete volume calculated: 450 cubic yards. Pulling regional material cost index..." },
            { type: 'system', text: ">> querying supplier APIs... Average cost: $135/cubic yard. Total base material: $60,750." },
            { type: 'agent', name: "Construction Agent", text: "Found material matches. Drafting line items: Concrete slab foundation (450 cy @ $135 = $60,750), reinforcement mesh ($4,800), and labor allocation ($18,000). Total project estimate: $83,550." },
            { type: 'user', text: "Approve that. Send RFP to our top three concrete vendors." },
            { type: 'system', text: ">> Estimating sheet approved. Syncing to Procore ERP. Pulling Vendor List: [Sully's Concrete, Apex Materials, Titan Mix]..." },
            { type: 'agent', name: "Construction Agent", text: "Blueprints and RFP package generated and emailed to Sully's Concrete, Apex Materials, and Titan Mix. Responses set to trigger notification in #ops-bids." },
            { type: 'system', text: ">> Vendor emails dispatched. Status: WAITING FOR BIDS." }
        ],
        // Scenario 3: Customer Support
        [
            { type: 'user', text: "Why was I charged twice for invoice #4421?" },
            { type: 'system', text: ">> Initializing SupportTriageAgent... Scanning billing ledger..." },
            { type: 'agent', name: "Support Agent", text: "Checking Invoice #4421 in Stripe database... Found transaction log. I see a duplicate charge event ID ch_9281a (Authorization) and ch_9281b (Capture) timed 2 seconds apart due to a gateway timeout." },
            { type: 'system', text: ">> Error Isolated. Auto-reversal available under SLA Rule 4." },
            { type: 'agent', name: "Support Agent", text: "Apologies for that. I found a gateway error that processed a duplicate charge. I have triggered an immediate refund of $189.00 for transaction ch_9281b. Funds will appear back on your card in 3-5 days." },
            { type: 'user', text: "Awesome, thank you for fixing that so fast!" },
            { type: 'system', text: ">> Processing transaction reversal... Customer satisfaction rating logged: 10/10. Closing Stripe ticket..." },
            { type: 'agent', name: "Support Agent", text: "You're very welcome! The invoice is now updated and marked paid. Is there anything else I can assist you with today?" },
            { type: 'system', text: ">> Session terminated. Ledger synced. Status: IDLE." }
        ]
    ];

    let currentScenarioIdx = 0;
    let isTyping = false;

    // Helper to create typing indicator
    function createTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'chat-bubble agent typing-indicator-bubble';
        div.innerHTML = `
            <div class="agent-name">Agent Thinking</div>
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        return div;
    }

    // Custom typing effect
    function typeText(element, text, speed = 15) {
        return new Promise(resolve => {
            let i = 0;
            element.textContent = '';
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    chatArea.scrollTop = chatArea.scrollHeight;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }

    async function runSimulation(scenario) {
        isTyping = true;
        chatArea.innerHTML = '';
        runBtn.disabled = true;
        runBtn.style.opacity = '0.5';

        for (const step of scenario) {
            if (step.type === 'user') {
                const bubble = document.createElement('div');
                bubble.className = 'chat-bubble user';
                chatArea.appendChild(bubble);
                await typeText(bubble, step.text, 20);
                await new Promise(r => setTimeout(r, 600));
            } else if (step.type === 'system') {
                const bubble = document.createElement('div');
                bubble.className = 'chat-bubble system';
                chatArea.appendChild(bubble);
                await typeText(bubble, step.text, 10);
                await new Promise(r => setTimeout(r, 800));
            } else if (step.type === 'agent') {
                // Show thinking indicator first
                const indicator = createTypingIndicator();
                chatArea.appendChild(indicator);
                chatArea.scrollTop = chatArea.scrollHeight;
                
                // Simulate thinking time
                await new Promise(r => setTimeout(r, 1200));
                
                // Remove indicator and append text bubble
                chatArea.removeChild(indicator);
                
                const bubble = document.createElement('div');
                bubble.className = 'chat-bubble agent';
                bubble.innerHTML = `<div class="agent-name">${step.name}</div><span class="agent-text"></span>`;
                chatArea.appendChild(bubble);
                
                const textSpan = bubble.querySelector('.agent-text');
                await typeText(textSpan, step.text, 15);
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        isTyping = false;
        runBtn.disabled = false;
        runBtn.style.opacity = '1';
    }

    // Trigger simulation
    if (chatArea && runBtn) {
        // Initial auto-run after a short delay
        setTimeout(() => {
            runSimulation(simulationScenarios[currentScenarioIdx]);
        }, 1500);

        // Click to toggle next scenario
        runBtn.addEventListener('click', () => {
            if (isTyping) return;
            currentScenarioIdx = (currentScenarioIdx + 1) % simulationScenarios.length;
            runSimulation(simulationScenarios[currentScenarioIdx]);
        });
    }

    /* ==========================================
       CONSULTATION FORM HANDLING
       ========================================== */
    const consultForm = document.getElementById('consultation-form');
    const formResponse = document.getElementById('form-response');
    const submitBtn = document.getElementById('form-submit-btn');

    if (consultForm) {
        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('f-name').value.trim();
            const email = document.getElementById('f-email').value.trim();
            const website = document.getElementById('f-website').value.trim();
            const industry = document.getElementById('f-industry').value;

            if (!name || !email) {
                formResponse.textContent = "Please fill in all required fields.";
                formResponse.className = "form-response error";
                formResponse.classList.remove('hidden');
                return;
            }

            // Simulate form loading state
            submitBtn.disabled = true;
            submitBtn.textContent = "Scheduling Consultation...";
            formResponse.classList.add('hidden');

            setTimeout(() => {
                // Success output
                submitBtn.textContent = "Schedule Assessment";
                submitBtn.disabled = false;
                
                formResponse.innerHTML = `
                    <strong>Success!</strong> Your free AI readiness assessment has been requested.<br>
                    An automation engineer will contact you at <strong>${email}</strong> within 24 hours.
                `;
                formResponse.className = "form-response success";
                formResponse.classList.remove('hidden');

                // Clear fields
                consultForm.reset();
            }, 1500);
        });
    }
});
