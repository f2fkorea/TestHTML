// 버튼 ripple(가벼운 포인터 반응)
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('pointerdown', e=>{
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--x', `${e.clientX - r.left}px`);
    btn.style.setProperty('--y', `${e.clientY - r.top}px`);
  });
});

// 다크모드 토글 + 저장
const root = document.documentElement;
const KEY = 'theme';
const saved = localStorage.getItem(KEY);
if (saved === 'dark') root.classList.add('dark');

const toggle = document.getElementById('themeToggle');
const paintIcon = () => toggle.textContent = root.classList.contains('dark') ? '🌞' : '🌙';
paintIcon();

toggle.addEventListener('click', ()=>{
  root.classList.toggle('dark');
  localStorage.setItem(KEY, root.classList.contains('dark') ? 'dark' : 'light');
  paintIcon();
});

// 스크롤 리빌 애니메이션
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if (e.isIntersecting) {
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
},{ threshold: .12 });

document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

// 스크롤 시 “맨 위로” 버튼
const toTop = document.getElementById('toTop');
const onScroll = ()=>{
  if (window.scrollY > 280) toTop.classList.add('show');
  else toTop.classList.remove('show');
};
window.addEventListener('scroll', onScroll);
toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
onScroll();
// ----- 네비 그림자 토글 -----
const siteNav = document.getElementById('siteNav');
const paintShadow = () => siteNav?.classList.toggle('is-stuck', window.scrollY > 8);
paintShadow();
window.addEventListener('scroll', paintShadow, { passive: true });

// ----- 스크롤 스파이 -----
const links = document.querySelectorAll('.nav_links a[href^="#"]');
const map = new Map([...links].map(a => [a.getAttribute('href').slice(1), a]));
const sections = [...document.querySelectorAll('main section[id]')];

const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    map.forEach((a, key) => a.classList.toggle('active', key === id));
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach(s => spy.observe(s));



// [추가] 로컬/배포 환경 자동 전환
document.addEventListener('DOMContentLoaded', () => {
  const isLocal = ['127.0.0.1', 'localhost'].includes(location.hostname);

  const buttons = [
    { sel: '.btn--github', name: 'GitHub' },
    { sel: '.btn--google', name: 'Google' },
    { sel: '.btn--naver',  name: 'Naver'  },
  ];

  buttons.forEach(({ sel, name }) => {
    const el = document.querySelector(sel);
    if (!el) return;

    el.addEventListener('click', (e) => {
      if (isLocal) {
        e.preventDefault(); // 로컬에서는 이동 막기
        console.log(`${name} 버튼이 클릭되었습니다! (로컬 테스트)`);
      } else {
        console.log(`${name} 페이지로 이동합니다!`);
      }
    });
  });
});