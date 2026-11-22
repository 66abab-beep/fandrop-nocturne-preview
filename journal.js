const q = selector => document.querySelector(selector);
const track = q('#track');
let current = 0;
const number = value => String(value).padStart(2, '0');
photos.forEach(([id, en, zh, type, caption], index) => {
  const frame = document.createElement('figure');
  const image = new Image();
  image.src = 'assets/' + id + '.webp';
  image.alt = zh + '。' + caption;
  image.draggable = false;
  frame.append(image);
  track.append(frame);
});
function describe(index) {
  current = index;
  const [id, en, zh, type, caption] = photos[index];
  q('#title').textContent = en;
  q('#name').textContent = zh;
  q('#caption').textContent = caption;
  q('#credit').href = 'https://www.instagram.com/p/' + id + '/';
  q('#count').textContent = number(index + 1) + ' / ' + number(photos.length);
  q('#prev').disabled = index === 0;
  q('#next').disabled = index === photos.length - 1;
}
function turn(index) {
  if (index < 0 || index >= photos.length) return;
  track.scrollLeft = track.clientWidth * index;
  describe(index);
}
track.addEventListener('scroll', () => {
  const index = Math.max(0, Math.min(photos.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
  if (index !== current) describe(index);
}, {passive:true});
track.addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  turn(current + (event.key === 'ArrowRight' ? 1 : -1));
});
q('#prev').onclick = () => turn(current - 1);
q('#next').onclick = () => turn(current + 1);
function filter(type) {
  q('.grid').replaceChildren();
  document.querySelectorAll('.filters button').forEach(b => b.setAttribute('aria-pressed', b.textContent === type));
  photos.forEach(([id, en, zh, category], index) => {
    if (type !== '全部' && category !== type) return;
    const card = document.createElement('button');
    card.className = 'card';
    card.innerHTML = '<img loading="lazy" alt="" src="assets/'+id+'.webp"><span class="meta">PLATE '+number(index+1)+' / '+category+'</span><strong>'+zh+'</strong>';
    card.onclick = () => {
      turn(index);
      q('#reader').scrollIntoView();
      track.focus({preventScroll:true});
    };
    q('.grid').append(card);
  });
}
for (const type of ['全部','光影','插畫']) {
  const button = document.createElement('button');
  button.textContent = type;
  button.onclick = () => filter(type);
  q('.filters').append(button);
}
q('#notesLink').onclick = () => { q('#notes').open = true; };
filter('全部');
describe(0);
