/*
   STENO MASTER - Core Application Logic
   Handles: Scroll Animations, Tab Switching, Chatbot, Certificates, Inquiry Reports, Admin Panel
*/

const initialCertificates = [
    { id: "SM-2024-001", name: "Rahul Sharma", course: "Hindi Shorthand Professional", status: "completed", date: "2024-05-15" },
    { id: "SM-2024-002", name: "Priya Singh", course: "English Shorthand Intermediate", status: "not_completed", date: "" },
    { id: "SM-2023-100", name: "Amit Kumar", course: "Hindi Shorthand Beginner", status: "completed", date: "2023-12-20" }
];

const initialBlogs = [
    {
        id: "blog-1",
        author: "Sandeep Kumar",
        title: "Cleared Stenographer Grade C Exam!",
        date: "May 25, 2026",
        content: "I joined Steno Master in 2024 under the expert guidance of their faculty at Lahoria Chowk. Starting from zero in English shorthand, I reached a speed of 100 WPM within 10 months. The dictation practice and daily mock transcriptions match the actual exam interface. Heartfelt thanks to the team for helping me secure a central govt job!",
        status: "approved"
    }
];

const initialResources = {
    dictations: [
        { title: "Beginner Stroke Practice", wpm: 40, lang: "English", file: "#" },
        { title: "State Board Dictation Mock", wpm: 80, lang: "Hindi", file: "#" },
        { title: "Grade C Practice Test", wpm: 100, lang: "English", file: "#" }
    ],
    strokes: [
        { title: "Hindi Alphabet Consonants Chart", lang: "Hindi", file: "#" },
        { title: "Pitman Shorthand Brief Forms Guide", lang: "English", file: "#" }
    ],
    tutorials: [
        { title: "Shorthand Basic Stems & Strokes Lesson 1", type: "video", length: "10:15" },
        { title: "Double Consonant Curves Explanation", type: "video", length: "14:20" }
    ]
};

const initialStudentCorner = {
    awards: [
        { title: "State Level Speed Champions 2025", desc: "First rank in Hindi speed competition.", image: "" },
        { title: "Outstanding Achiever Award", desc: "For 100% transcript accuracy.", image: "" }
    ],
    functions: [
        { title: "Annual Day Function 2025", desc: "Celebrations at Lahoria Chowk Campus.", image: "" },
        { title: "Teacher's Day Celebrations", desc: "Honoring our mentors and senior stenographers.", image: "" }
    ],
    placements: [
        { title: "Amit Kumar - High Court Steno", desc: "Selected at Haryana High Court (Hindi Shorthand).", image: "" },
        { title: "Rahul Sharma - Grade D Placement", desc: "Placed in Central Ministry, New Delhi.", image: "" }
    ]
};

function initializeDB() {
    if (!localStorage.getItem('sm_certs')) {
        localStorage.setItem('sm_certs', JSON.stringify(initialCertificates));
    }
    if (!localStorage.getItem('sm_blogs')) {
        localStorage.setItem('sm_blogs', JSON.stringify(initialBlogs));
    }
    if (!localStorage.getItem('sm_resources')) {
        localStorage.setItem('sm_resources', JSON.stringify(initialResources));
    }
    if (!localStorage.getItem('sm_student_corner')) {
        localStorage.setItem('sm_student_corner', JSON.stringify(initialStudentCorner));
    }
    if (!localStorage.getItem('sm_inquiries')) {
        localStorage.setItem('sm_inquiries', JSON.stringify([]));
    }
}
initializeDB();

document.addEventListener('DOMContentLoaded', () => {
    // 4. Course switcher Hindi vs English
    const courseLangToggle = document.getElementById('course-lang-toggle');
    const toggleBtns = document.querySelectorAll('.toggle-btn');

    if (courseLangToggle) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                toggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const selectedLang = btn.getAttribute('data-lang');
                renderCourses(selectedLang);
            });
        });
        renderCourses('hindi');
    }

    function renderCourses(lang) {
        const grid = document.getElementById('courses-grid');
        grid.innerHTML = '';

        const coursesData = {
            hindi: [
                {
                    level: "BEGINNER",
                    desc: "Start Hindi shorthand from absolute scratch. Learn fundamental characters, symbol connections, and primary speed builds.",
                    features: ["Hindi Alphabet & Stroke Patterns", "Shorthand Consonant Joinings", "Slow Dictations (30-40 WPM)", "Exercise Dictation Transcriptions"],
                    prereq: ""
                },
                {
                    level: "INTERMEDIATE",
                    desc: "Build speed, learn contractions, and transcribe shorthand passages. Designed for students who completed primary strokes.",
                    features: ["Compound Strokes & Loops", "Speed Building (60-80 WPM)", "Advanced Words Contractions", "Government Exam Pattern Practice"],
                    prereq: "Student must have completed basic Hindi Shorthand stroke theory book."
                },
                {
                    level: "PROFESSIONAL",
                    desc: "Competitive-level transcription for advanced government job aspirants. Refined for full speed and maximum accuracy.",
                    features: ["High Speed Dictations (100-120 WPM)", "State/Central Exam Simulations", "Transcripts Evaluation & Error Audits"],
                    prereq: "Student must write Hindi dictation at 80 WPM and 100 WPM before joining this level."
                }
            ],
            english: [
                {
                    level: "BEGINNER",
                    desc: "Start English shorthand symbols, strokes, and Pitman rules. Built for students starting from scratch.",
                    features: ["English Alphabet & Stroke Directions", "Intro to Pitman Shorthand System", "Vowels & Halving Principles", "Slow Dictation Drafts (30-40 WPM)"],
                    prereq: ""
                },
                {
                    level: "INTERMEDIATE",
                    desc: "Enhance writing flow, memorize phrases, and improve speed. Focuses on core book completions.",
                    features: ["Speeds: 60-80 WPM Dictations", "Pitman Book Completions", "Brief Forms & Hook Extensions", "Full Dictations Transcription Practice"],
                    prereq: "Student must have completed the PITMAN book"
                },
                {
                    level: "PROFESSIONAL",
                    desc: "Peak speed training and live mock test assessments matching competitive exam standards.",
                    features: ["Advanced Speeds: 100-120 WPM", "Daily Newspaper Editorial Dictation", "Interactive Exam Simulations"],
                    prereq: "Student must be able to write dictation at 80 WPM and 100 WPM before joining this level"
                }
            ]
        };

        const langCourses = coursesData[lang];

        langCourses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';

            let prereqHtml = '';
            if (course.prereq) {
                prereqHtml = `
                            <div class="course-prereq">
                                <i class="fas fa-info-circle"></i>
                                <span>${course.prereq}</span>
                            </div>
                        `;
            }

            let featuresHtml = '';
            course.features.forEach(feat => {
                featuresHtml += `<li><i class="fas fa-check"></i> ${feat}</li>`;
            });

            card.innerHTML = `
                        <div>
                            <span class="course-badge">${lang} shorthand</span>
                            <h3 class="course-title">${course.level}</h3>
                            <p class="course-desc">${course.desc}</p>
                            ${prereqHtml}
                            <ul class="course-features">
                                ${featuresHtml}
                            </ul>
                        </div>
                        <button class="course-enroll-btn" onclick="scrollToInquiry('${lang.toUpperCase()} - ${course.level}')">Enroll Now</button>
                    `;
            grid.appendChild(card);
        });
    }

    window.scrollToInquiry = function (courseName) {
        const inquireSection = document.getElementById('inquire');
        if (inquireSection) {
            const headerOffset = 80;
            const elementPosition = inquireSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // 5. Render Study Resources list
    function renderResourcesList() {
        const res = JSON.parse(localStorage.getItem('sm_resources')) || initialResources;
        const dictList = document.getElementById('dictation-list');
        if (dictList) {
            dictList.innerHTML = '';
            res.dictations.forEach(d => {
                const item = document.createElement('div');
                item.className = 'audio-track-item';
                item.innerHTML = `
                            <div class="audio-track-header">
                                <span>${d.title} (${d.lang})</span>
                                <span style="color:var(--primary-red);">${d.wpm} WPM</span>
                            </div>
                            <audio controls>
                                ${d.file && d.file !== '#' ? `<source src="${d.file}" type="audio/mpeg">` : ''}
                                Your browser does not support the audio element.
                            </audio>
                        `;
                dictList.appendChild(item);
            });
        }

        const strokeList = document.getElementById('strokes-list');
        if (strokeList) {
            strokeList.innerHTML = '';
            res.strokes.forEach(s => {
                const item = document.createElement('div');
                item.className = 'download-link-item';
                item.innerHTML = `
                            <span>${s.title} (${s.lang})</span>
                            <a href="${s.file}" download><i class="fas fa-download"></i> PDF Reference</a>
                        `;
                strokeList.appendChild(item);
            });
        }
    }
    renderResourcesList();

    // Student Corner Main tabs switching (Practice Materials, Achievements & Placements, Verify Certificate)
    const studentTabBtns = document.querySelectorAll('.student-tab-btn');
    const studentPanes = document.querySelectorAll('.student-pane');

    studentTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            studentTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const selectedPane = btn.getAttribute('data-tab');
            studentPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane-${selectedPane}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // Student Corner Sub-tabs switching inside Achievements & Placements (Awards, Functions, Placements, Success Blogs)
    const studentSubTabBtns = document.querySelectorAll('.student-sub-tab-btn');
    const studentSubPanes = document.querySelectorAll('.student-sub-pane');

    studentSubTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            studentSubTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const selectedSubPane = btn.getAttribute('data-sub-tab');
            studentSubPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `sub-pane-${selectedSubPane}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    function renderStudentCornerGallery() {
        const sc = JSON.parse(localStorage.getItem('sm_student_corner')) || initialStudentCorner;
        const categories = ['awards', 'functions', 'placements'];

        categories.forEach(cat => {
            const grid = document.getElementById(`${cat}-grid`);
            if (!grid) return;
            grid.innerHTML = '';

            const placeholder = document.createElement('div');
            placeholder.className = 'student-corner-upload-notice';
            placeholder.innerHTML = `
                        <i class="fas fa-lock"></i>
                        <h5>Admin Managed Uploads</h5>
                        <p>New pictures, certifications, placements, and event coverages are posted exclusively by the institute admin.</p>
                    `;
            grid.appendChild(placeholder);

            (Array.isArray(sc[cat]) ? sc[cat] : []).forEach(item => {
                const card = document.createElement('div');
                card.className = 'gallery-item';
                const imgHtml = item.image ?
                    `<img src="${item.image}" alt="${item.title}">` :
                    `<div class="gallery-img-placeholder">
                                <i class="fas fa-image"></i>
                                <span style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted-dark);">Image Preview</span>
                             </div>`;
                card.innerHTML = `
                            <div class="gallery-img-container">
                                ${imgHtml}
                            </div>
                            <div class="gallery-info">
                                <span class="gallery-tag">${cat} corner</span>
                                <h4 class="gallery-title">${item.title}</h4>
                                <p class="gallery-desc">${item.desc}</p>
                            </div>
                        `;
                grid.appendChild(card);
            });
        });
    }
    renderStudentCornerGallery();

    // 6. Chatbot Assistant Core
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const suggestionChips = document.querySelectorAll('.chatbot-chips-container .chip');

    const shorthandKeywords = {
        shorthand: "Shorthand is a rapid writing method that uses symbolic strokes and curves instead of traditional alphabets to keep pace with human speech. It is used in fields like courts, parliaments, and reporter jobs.",
        pitman: "The Pitman shorthand system, invented by Sir Isaac Pitman in 1837, is based on stenographic strokes. Strokes represent consonants and dots/dashes denote vowels. Steno Master provides Pitman certification training in Hisar.",
        gregg: "Gregg Shorthand is a phonetic writing system created by John Robert Gregg in 1888. Unlike Pitman, Gregg uses stroke thickness patterns less rigidly and is based on oval shapes and long curves. Pitman is more common in Indian government competitive exams.",
        career: "Stenographers have a massive career scope! In India, government sectors hire heavily. Roles include Stenographer Grade C/D, Personal Assistants, and Private Secretaries across Ministries, High Courts, HSSC, and defense networks.",
        sectors: "Stenographers are hired in diverse government sectors: State boards like HSSC, District & High Courts, Parliament Secretariat, Indian Railways, Defense organizations (DRDO, ISRO), and central ministries.",
        salary: "Stenographer salary starts from Level 4 (Grade Pay 2400, approx Rs. 35,000-40,000/month) to Level 6 (Grade Pay 4200, approx Rs. 55,000-60,000/month) and goes up to Grade Pay 4600/4800 for senior personal assistants.",
        wpm: "Exam shorthand requirements range from 80 WPM (Grade D & State Court exams) to 100 WPM (Grade C) or 120 WPM (Parliamentary Reporters). Higher accuracy is crucial.",
        exams: "Major exams include: 1) Stenographer Grade C & D, 2) HSSC Court Clerk & Steno, 3) High Court & District Court Stenos, 4) DSSSB Steno. Steno Master has a 100% Govt Job preparation curriculum.",
        hindi: "Hindi Shorthand (Stenography) is highly demanded in state ministries (Haryana, UP, Rajasthan) and local court systems. Our Hindi shorthand courses do not require Pitman books as it follows standard Hindi systems (Rishi/Vishisht/Manak).",
        english: "English Shorthand is based on the Pitman shorthand book structure. It is globally recognized and widely tested in all major central exams like High Court Recruitments.",
        tips: "To master steno: 1) Practice strokes daily. 2) Focus on shorthand outlines shape accuracy before pushing speed. 3) Practice audio dictations daily starting from 40 WPM to 80 WPM. 4) Transcribe on computers to track spelling accuracy.",
        duration: "Basic course takes about 6 to 8 months to reach 80 WPM. Standard professional speed (100-120 WPM) takes another 4 to 6 months of intense daily dictation and typing drills.",
        courses: "STENO MASTER offers 3 structured levels for both Hindi and English: Beginner (basic theory), Intermediate (60-80 WPM speed-building), and Professional (100-120 WPM mock test simulation).",
        fees: "Course fees vary by duration and level (Hindi vs English). Please reach out to Steno Master at Lahoria Chowk, Hisar, or call 9215307440 for exact fee structures and ongoing discounts.",
        address: "STENO MASTER is located at Lahoria Chowk, Hisar, Haryana. It is a renowned landmark listed on Google Maps for premium stenography coaching.",
        contact: "You can call Steno Master at 9215307440, WhatsApp at 9215307440, or email us at stenomasterhsr@gmail.com. Visit our campus at Lahoria Chowk, Hisar."
    };

    const blockedWords = [
        "cuss", "abuse", "foul", "f***", "s***", "fuck", "fucker", "motherfucker",
        "shit", "bullshit", "piece of shit", "bitch", "son of a bitch", "bastard",
        "asshole", "dickhead", "prick", "jackass", "cunt", "whore", "slut",
        "idiot", "moron", "stupid", "dumb", "jerk", "crap", "nonsense",
        "madarchod", "madarchot", "mcchod", "behenchod", "bhenchod", "bahenchod",
        "benchod", "bhosdike", "bhosdi ke", "bhosadike", "bsdk", "chutiya", "chutiye",
        "chutiyapa", "gandu", "gaand", "harami", "haraami", "kamina", "kameena",
        "kamine", "kutta", "kutte", "randi", "randwa", "lodu", "laude", "lawde",
        "lund", "jhaatu", "jhatu", "bakchod", "bakchodi", "saala", "sala",
        "मादरचोद", "बहनचोद", "भोसड़ीके", "चूतिया", "गांडू", "हरामी", "कमीना", "रंडी"
    ];
    const blockedWordPatterns = blockedWords.map((word) => {
        const escapedWord = word
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/\s+/g, '\\s+');
        return new RegExp(`(^|[^\\p{L}\\p{N}])${escapedWord}(?=$|[^\\p{L}\\p{N}])`, 'iu');
    });

    function sendChatMessage(text) {
        if (!text.trim()) return;

        appendMessage(text, 'user');
        chatInput.value = '';

        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const reply = generateBotReply(text);
            appendMessage(reply, 'bot');
        }, 1200);
    }

    function appendMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `chat-message ${sender}`;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        msg.innerHTML = `
                    <div class="chat-bubble"></div>
                    <div class="chat-time">${time}</div>
                `;
        msg.querySelector('.chat-bubble').textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'chat-typing-indicator';
        indicator.className = 'chat-message bot';
        indicator.innerHTML = `
                    <div class="chat-bubble">
                        <div class="typing-dots">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                    </div>
                `;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) indicator.remove();
    }

    function generateBotReply(text) {
        const lower = text.toLowerCase();
        const containsBlock = blockedWordPatterns.some(pattern => pattern.test(lower));
        if (containsBlock) {
            return "I'm here to help with shorthand-related questions only. Please keep the conversation respectful.";
        }

        if (lower.includes('what is shorthand') || lower.includes('definition') || lower.includes('shorthand works')) {
            return shorthandKeywords.shorthand;
        } else if (lower.includes('pitman') && lower.includes('gregg')) {
            return shorthandKeywords.pitman + " " + shorthandKeywords.gregg;
        } else if (lower.includes('pitman')) {
            return shorthandKeywords.pitman;
        } else if (lower.includes('gregg')) {
            return shorthandKeywords.gregg;
        } else if (lower.includes('career') || lower.includes('scope') || lower.includes('jobs') || lower.includes('salary')) {
            return shorthandKeywords.career + " " + shorthandKeywords.salary;
        } else if (lower.includes('sector') || lower.includes('hire')) {
            return shorthandKeywords.sectors;
        } else if (lower.includes('speed') || lower.includes('wpm')) {
            return shorthandKeywords.wpm;
        } else if (lower.includes('exam') || lower.includes('hssc') || lower.includes('court')) {
            return shorthandKeywords.exams;
        } else if (lower.includes('hindi')) {
            return shorthandKeywords.hindi;
        } else if (lower.includes('english')) {
            return shorthandKeywords.english;
        } else if (lower.includes('tip') || lower.includes('practice') || lower.includes('learn')) {
            return shorthandKeywords.tips;
        } else if (lower.includes('how long') || lower.includes('duration') || lower.includes('month') || lower.includes('time')) {
            return shorthandKeywords.duration;
        } else if (lower.includes('course') || lower.includes('level') || lower.includes('beginner')) {
            return shorthandKeywords.courses;
        } else if (lower.includes('fee') || lower.includes('cost') || lower.includes('charge')) {
            return shorthandKeywords.fees;
        } else if (lower.includes('address') || lower.includes('location') || lower.includes('where is')) {
            return shorthandKeywords.address;
        } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('email') || lower.includes('whatsapp')) {
            return shorthandKeywords.contact;
        }

        if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey')) {
            return "Hello! I am your STENO MASTER assistant. Ask me anything about shorthand, Pitman systems, typing speed, career paths, or our course structures.";
        }
        return "I'm specialized in Shorthand, Stenography, and Steno Master course details. Could you please rephrase or pick one of the quick suggestions below?";
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => sendChatMessage(chatInput.value));
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage(chatInput.value);
        });

        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => sendChatMessage(chip.innerText));
        });
    }

    // 7. Student Experience Blog Board
    const blogForm = document.getElementById('blog-form');
    const blogPostsContainer = document.getElementById('blog-posts-container');

    function renderBlogPosts() {
        if (!blogPostsContainer) return;
        const posts = JSON.parse(localStorage.getItem('sm_blogs')) || initialBlogs;
        blogPostsContainer.innerHTML = '';

        const approvedPosts = posts.filter(p => p.status === 'approved');
        if (approvedPosts.length === 0) {
            blogPostsContainer.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-muted-dark);">No experience stories published yet. Submit yours above!</p>';
            return;
        }

        approvedPosts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'blog-post';
            article.innerHTML = `
                        <div class="blog-meta">
                            <div class="blog-meta-item"><i class="fas fa-user"></i> By ${post.author}</div>
                            <div class="blog-meta-item"><i class="fas fa-calendar"></i> ${post.date}</div>
                        </div>
                        <h4 class="blog-post-title">${post.title}</h4>
                        <p class="blog-post-content">${post.content}</p>
                    `;
            blogPostsContainer.appendChild(article);
        });
    }
    renderBlogPosts();

    if (blogForm) {
        blogForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('blog-name').value.trim();
            const title = document.getElementById('blog-title').value.trim();
            const story = document.getElementById('blog-story').value.trim();

            if (!name || !title || !story) {
                showToast("Please fill all fields.");
                return;
            }

            const newPost = {
                id: 'blog-' + Date.now(),
                author: name,
                title: title,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                content: story,
                status: 'pending'
            };

            const posts = JSON.parse(localStorage.getItem('sm_blogs')) || initialBlogs;
            posts.push(newPost);
            localStorage.setItem('sm_blogs', JSON.stringify(posts));

            const emailTo = "stenomasterhsr@gmail.com";
            const subject = encodeURIComponent(`Steno Master Blog Approval Request: ${title}`);
            const body = encodeURIComponent(
                `Hello Admin,\n\nA new student experience story has been submitted for approval.\n\n` +
                `Student Name: ${name}\n` +
                `Story Title: ${title}\n\n` +
                `Experience Details:\n"${story}"\n\n` +
                `Please log in to the Steno Master Admin Panel to approve or reject this blog post.\n\n` +
                `Regards,\nSteno Master Website`
            );

            showToast("Story logged! Opening email client to send approval request to admin.");
            blogForm.reset();

            setTimeout(() => {
                window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
            }, 1000);
        });
    }

    // 8. Download Certificate search & Dynamic SVG preview
    const certInput = document.getElementById('cert-input');
    const certCheckBtn = document.getElementById('cert-check-btn');
    const certResultContainer = document.getElementById('cert-result-container');
    const certModal = document.getElementById('cert-modal');
    const certModalClose = document.querySelector('.cert-close-btn');
    const certPrintBtn = document.getElementById('cert-print-btn');

    let activeCertificate = null;

    if (certCheckBtn) {
        certCheckBtn.addEventListener('click', () => {
            const studentId = certInput.value.trim().toUpperCase();
            if (!studentId) {
                showToast("Please enter a Student ID");
                return;
            }

            const certs = JSON.parse(localStorage.getItem('sm_certs')) || initialCertificates;
            const match = certs.find(c => c.id === studentId);

            certResultContainer.style.display = 'block';

            if (match) {
                activeCertificate = match;
                if (match.status === 'completed') {
                    certResultContainer.innerHTML = `
                                <div class="cert-result-box success">
                                    <i class="fas fa-check-circle" style="font-size:2rem;margin-bottom:10px;"></i>
                                    <h5 style="font-weight:700;font-size:1.1rem;margin-bottom:8px;">Certificate Found & Verified</h5>
                                    <p><strong>Student Name:</strong> ${match.name}</p>
                                    <p><strong>Course:</strong> ${match.course}</p>
                                    <p><strong>Completion Date:</strong> ${match.date}</p>
                                    <button class="cert-download-btn" onclick="openCertificatePreview()"><i class="fas fa-file-pdf"></i> Download & View Certificate</button>
                                </div>
                            `;
                } else {
                    certResultContainer.innerHTML = `
                                <div class="cert-result-box warning">
                                    <i class="fas fa-exclamation-triangle" style="font-size:2rem;margin-bottom:10px;"></i>
                                    <h5 style="font-weight:700;font-size:1.1rem;margin-bottom:8px;">Course Incomplete</h5>
                                    <p>Your course is not yet marked complete. Contact STENO MASTER at 92153 07440.</p>
                                </div>
                            `;
                }
            } else {
                activeCertificate = null;
                certResultContainer.innerHTML = `
                            <div class="cert-result-box error">
                                <i class="fas fa-times-circle" style="font-size:2rem;margin-bottom:10px;"></i>
                                <h5 style="font-weight:700;font-size:1.1rem;margin-bottom:8px;">ID Not Found</h5>
                                <p>Student ID not found. Please check your ID or contact us at 92153 07440.</p>
                            </div>
                        `;
            }
        });
    }

    window.openCertificatePreview = function () {
        if (!activeCertificate) return;
        const svgWrap = document.getElementById('cert-svg-wrap');
        svgWrap.innerHTML = `
                    <svg id="certificate-svg" viewBox="0 0 800 600" width="100%" height="auto" style="border:15px double #E21D3F; padding:20px; background-color:#ffffff; font-family:'Cinzel', 'Playfair Display', Georgia, serif;">
                        <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#E21D3F" stroke-width="4"></rect>
                        <text x="400" y="320" font-family="'Cinzel'" font-size="60" fill="rgba(226, 29, 63, 0.03)" text-anchor="middle" font-weight="900" transform="rotate(-15 400,320)">STENO MASTER</text>
                        <text x="400" y="90" font-size="28" fill="#E21D3F" text-anchor="middle" font-weight="700" letter-spacing="4">STENO MASTER</text>
                        <text x="400" y="115" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" fill="#666" text-anchor="middle" letter-spacing="2">PREMIER SHORTHAND INSTITUTE OF HISAR</text>
                        <text x="400" y="130" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" fill="#999" text-anchor="middle" letter-spacing="1">ESTABLISHED 2014 | LAHORIA CHOWK, HISAR, HARYANA</text>
                        <text x="400" y="200" font-size="24" fill="#1a1a1a" text-anchor="middle" font-weight="bold" letter-spacing="2">CERTIFICATE OF COMPLETION</text>
                        <text x="400" y="240" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" fill="#555" text-anchor="middle" font-style="italic">This is to certify that</text>
                        <text x="400" y="290" font-size="32" fill="#E21D3F" text-anchor="middle" font-weight="bold" text-decoration="underline">${activeCertificate.name.toUpperCase()}</text>
                        <text x="400" y="340" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" fill="#555" text-anchor="middle" font-style="italic">has successfully completed the course in</text>
                        <text x="400" y="380" font-size="22" fill="#1a1a1a" text-anchor="middle" font-weight="bold">${activeCertificate.course.toUpperCase()}</text>
                        <text x="400" y="420" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" fill="#555" text-anchor="middle">meeting all standards of shorthand dictation transcription, speeds, and rules.</text>
                        <line x1="150" y1="500" x2="300" y2="500" stroke="#ccc" stroke-width="1"></line>
                        <text x="225" y="520" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" fill="#777" text-anchor="middle">Student ID: ${activeCertificate.id}</text>
                        <text x="225" y="535" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" fill="#aaa" text-anchor="middle">Date: ${activeCertificate.date}</text>
                        <line x1="500" y1="500" x2="650" y2="500" stroke="#ccc" stroke-width="1"></line>
                        <text x="575" y="520" font-size="12" fill="#1a1a1a" text-anchor="middle" font-weight="bold">DIRECTOR SIGNATURE</text>
                        <text x="575" y="535" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" fill="#777" text-anchor="middle">STENO MASTER Institute</text>
                    </svg>
                `;
        certModal.showModal();
    };

    if (certModalClose) {
        certModalClose.addEventListener('click', () => {
            certModal.close();
        });
    }

    if (certPrintBtn) {
        certPrintBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 9. Inquire Now form submit & excel list report logs
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('inq-name').value.trim();
            const qualification = document.getElementById('inq-qualification').value;
            const contact = document.getElementById('inq-contact').value.trim();
            const email = document.getElementById('inq-email').value.trim();

            if (!name || !qualification || !email || !contact) {
                showToast("Please fill out all required fields marked with *");
                return;
            }

            const inquiryData = {
                id: 'inq-' + Date.now(),
                name, qualification, email, contact,
                timestamp: new Date().toLocaleString()
            };

            const inquiries = JSON.parse(localStorage.getItem('sm_inquiries')) || [];
            inquiries.push(inquiryData);
            localStorage.setItem('sm_inquiries', JSON.stringify(inquiries));

            showToast(`Inquiry submitted! We will contact you at ${contact}`);

            const emailTo = "stenomasterhsr@gmail.com";
            const subject = encodeURIComponent(`New Admission Inquiry: ${name}`);
            const body = encodeURIComponent(
                `Hello Admin,\n\nA new student has filled the inquiry form on the Steno Master website.\n\n` +
                `--- STUDENT DETAILS ---\n` +
                `Full Name: ${name}\n` +
                `Qualification: ${qualification}\n` +
                `Email ID: ${email}\n` +
                `Contact Number: ${contact}\n` +
                `Time: ${inquiryData.timestamp}\n\n` +
                `Please login to the Admin Dashboard to view/export the updated inquiries Excel report.\n\n` +
                `Regards,\nSteno Master Website`
            );

            inquiryForm.reset();

            setTimeout(() => {
                window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
            }, 1500);
        });
    }

    // -------------------------------------------------------------
    // 11. TOAST ALERTS SYSTEM
    // -------------------------------------------------------------
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;

        container.appendChild(toast);

        // Remove after 4s
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
    }
});
