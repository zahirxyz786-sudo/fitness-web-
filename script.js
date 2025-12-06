// Sticky Nav
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// Req 6: Hamburger Toggle Logic
const hamburger = document.getElementById('hamburger');
const navRight = document.getElementById('nav-right');
const navLinks = document.querySelectorAll('.nav-link'); 

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navRight.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navRight.classList.remove('active');
    });
});

// Req 4: Scroll Reveal Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// App Logic (Unchanged)
document.addEventListener('DOMContentLoaded', () => {
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [
        { id: 1, type: "Running", duration: 30, intensity: "Medium" },
        { id: 2, type: "HIIT", duration: 45, intensity: "High" }
    ];
    const form = document.getElementById('workout-form');
    const list = document.getElementById('workout-list');
    const filter = document.getElementById('filter-type');
    const sort = document.getElementById('sort-by');

    function render() {
        localStorage.setItem('workouts', JSON.stringify(workouts));
        list.innerHTML = '';
        let filtered = filter.value !== 'all' ? workouts.filter(w => w.type === filter.value) : workouts;
        if (sort.value === 'duration') filtered.sort((a, b) => a.duration - b.duration);
        else if (sort.value === 'intensity') { const m = { 'Low': 1, 'Medium': 2, 'High': 3 }; filtered.sort((a, b) => m[a.intensity] - m[b.intensity]); }
        else filtered.sort((a, b) => b.id - a.id);

        if (filtered.length === 0) list.innerHTML = '<li style="color:#555; text-align:center; padding: 20px;">No workouts found.</li>';

        filtered.forEach(w => {
            list.innerHTML += `
                        <li class="workout-card" style="border-left: 4px solid ${w.intensity === 'High' ? '#e7496e' : w.intensity === 'Medium' ? '#33fc01' : '#3498db'}">
                            <div><h3>${w.type}</h3><span style="color:#999; font-size:0.9rem;">${w.duration} mins • ${w.intensity}</span></div>
                            <button class="delete-btn" onclick="del(${w.id})">REMOVE</button>
                        </li>`;
        });
        const types = [...new Set(workouts.map(w => w.type))];
        filter.innerHTML = '<option value="all">SHOW ALL</option>' + types.map(t => `<option value="${t}" ${filter.value === t ? 'selected' : ''}>${t}</option>`).join('');
    }

    window.del = (id) => { workouts = workouts.filter(w => w.id !== id); render(); };
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        workouts.push({
            id: Date.now(),
            type: document.getElementById('workout-type').value,
            duration: parseInt(document.getElementById('duration').value),
            intensity: document.getElementById('intensity').value
        });
        render(); form.reset();
    });
    filter.addEventListener('change', render);
    sort.addEventListener('change', render);
    render();
});

