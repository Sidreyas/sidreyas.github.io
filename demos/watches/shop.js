// ===== Shared shop engine: product data, catalog cards, cart & modal =====
const PRODUCTS=[
  {id:1,name:"L'Aviateur",cat:"Chronograph",price:9000,img:"hero.jpg",rating:4.9,reviews:128,tag:"New",
    desc:"A bold pilot's chronograph with a tachymeter bezel and luminous gold accents — built for those who command time.",
    specs:{Movement:"Automatic chronograph",Case:"42mm stainless steel",Crystal:"Anti-reflective sapphire",Water:"100m",Strap:"Steel bracelet",Warranty:"2 years"}},
  {id:2,name:"Le Bleu",cat:"Classic",price:6400,img:"w01.jpg",rating:4.8,reviews:96,tag:"",
    desc:"A serene sapphire-blue sunburst dial on a refined Milanese mesh bracelet — quiet sophistication for any occasion.",
    specs:{Movement:"Swiss quartz",Case:"40mm steel",Crystal:"Sapphire",Water:"50m",Strap:"Mesh bracelet",Warranty:"2 years"}},
  {id:3,name:"L'Azur",cat:"Classic",price:4600,img:"w02.jpg",rating:4.7,reviews:74,tag:"",
    desc:"A clean, sunburst navy dial on a minimalist case — understated quartz precision for everyday refinement.",
    specs:{Movement:"Swiss quartz",Case:"40mm steel",Crystal:"Sapphire",Water:"50m",Strap:"Leather",Warranty:"2 years"}},
  {id:4,name:"Le Noir",cat:"Automatic",price:7400,img:"w03.jpg",rating:4.9,reviews:152,tag:"Bestseller",
    desc:"A commanding black-dial automatic with bold numerals and a day-date complication. Swiss made, built to last.",
    specs:{Movement:"Automatic, 42h reserve",Case:"43mm steel",Crystal:"Sapphire",Water:"100m",Strap:"Steel bracelet",Warranty:"2 years"}},
  {id:5,name:"Le Plongeur",cat:"Automatic",price:11200,img:"w04.jpg",rating:5.0,reviews:61,tag:"Limited",
    desc:"A professional-grade dive watch with a ceramic bezel and luminous markers — engineered for the deep, dressed for the city.",
    specs:{Movement:"Automatic, 48h reserve",Case:"43mm steel",Crystal:"Domed sapphire",Water:"300m",Strap:"Steel bracelet",Warranty:"3 years"}},
  {id:6,name:"L'Essence",cat:"Classic",price:5200,img:"w05.jpg",rating:4.6,reviews:88,tag:"",
    desc:"Timeless white dial, slim profile, and a rich leather strap — the essence of quiet luxury.",
    specs:{Movement:"Swiss quartz",Case:"39mm steel",Crystal:"Sapphire",Water:"50m",Strap:"Italian leather",Warranty:"2 years"}},
  {id:7,name:"Le Pilote",cat:"Automatic",price:8800,img:"p1.jpg",rating:4.8,reviews:103,tag:"",
    desc:"Aviation-inspired automatic with rose-gold case and a refined cream dial — heritage meets modern engineering.",
    specs:{Movement:"Automatic, 40h reserve",Case:"40mm rose gold PVD",Crystal:"Sapphire",Water:"50m",Strap:"Leather",Warranty:"2 years"}},
  {id:8,name:"L'Élégance",cat:"Classic",price:6100,img:"p2.jpg",rating:4.7,reviews:69,tag:"",
    desc:"Minimalist sophistication on the wrist — a barely-there profile and a dial of perfect restraint.",
    specs:{Movement:"Swiss quartz",Case:"38mm steel",Crystal:"Sapphire",Water:"30m",Strap:"Leather",Warranty:"2 years"}},
  {id:9,name:"Le Mystère",cat:"Skeleton",price:14500,img:"detail.jpg",rating:5.0,reviews:44,tag:"Limited",
    desc:"A flying-tourbillon skeleton in dramatic relief — our most complicated and coveted creation.",
    specs:{Movement:"Tourbillon, hand-wound",Case:"42mm steel",Crystal:"Double sapphire",Water:"30m",Strap:"Alligator leather",Warranty:"3 years"}},
  {id:10,name:"La Femme",cat:"Ladies",price:5800,img:"w11.jpg",rating:4.8,reviews:117,tag:"New",
    desc:"A slender, graceful timepiece designed for her — delicate proportions, luminous mother-of-pearl finish.",
    specs:{Movement:"Swiss quartz",Case:"34mm steel",Crystal:"Sapphire",Water:"30m",Strap:"Mesh bracelet",Warranty:"2 years"}},
];

const Shop=(function(){
  const money=n=>'$'+n.toLocaleString();
  const stars=r=>{const f=Math.round(r);return '★'.repeat(f)+'☆'.repeat(5-f);};

  function cardHTML(p){return `
    <div class="prod reveal in" data-id="${p.id}">
      <div class="ph">${p.tag?`<span class="tag">${p.tag}</span>`:''}<img src="img/${p.img}" alt="${p.name}">
        <div class="quick"><span>Quick view</span></div>
      </div>
      <div class="body">
        <div class="cat">${p.cat}</div>
        <h3>${p.name}</h3>
        <div class="rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} <span style="color:var(--faint)">(${p.reviews})</span></div>
        <div class="price">${money(p.price)}</div>
        <div class="add" data-add="${p.id}">+ Add to bag</div>
      </div>
    </div>`;}

  let cart=[]; // {id, qty}
  let mvId=null, mvQty=1;

  // toast
  let toastT;
  function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),1800);}

  function pulseBadge(){const b=document.getElementById('cartBadge');if(b&&b.animate)b.animate([{transform:'scale(1)'},{transform:'scale(1.5)'},{transform:'scale(1)'}],{duration:350});}

  function addToCart(id,qty=1){
    const ex=cart.find(c=>c.id===id);
    if(ex)ex.qty+=qty; else cart.push({id,qty});
    renderCart(); toast('Added to bag'); pulseBadge();
  }
  function changeQty(id,d){const c=cart.find(x=>x.id===id);if(!c)return;c.qty+=d;if(c.qty<=0)cart=cart.filter(x=>x.id!==id);renderCart();}
  function removeItem(id){cart=cart.filter(x=>x.id!==id);renderCart();}

  function renderCart(){
    const items=document.getElementById('cartItems');
    const badge=document.getElementById('cartBadge');
    const totalEl=document.getElementById('cartTotal');
    if(!items)return;
    const count=cart.reduce((s,c)=>s+c.qty,0);
    if(badge)badge.textContent=count;
    const total=cart.reduce((s,c)=>s+c.qty*PRODUCTS.find(p=>p.id===c.id).price,0);
    if(totalEl)totalEl.textContent=money(total);
    if(!cart.length){items.innerHTML='<div class="cart-empty">Your bag is empty.<br>Discover the collection.</div>';return;}
    items.innerHTML=cart.map(c=>{const p=PRODUCTS.find(x=>x.id===c.id);return `
      <div class="ci">
        <img src="img/${p.img}" alt="${p.name}">
        <div class="info">
          <h4>${p.name}</h4><div class="p">${money(p.price)}</div>
          <div class="qty"><button data-q="${p.id}|-1">−</button><span>${c.qty}</span><button data-q="${p.id}|1">+</button></div>
        </div>
        <button class="rm" data-rm="${p.id}"><span class="msi">delete</span></button>
      </div>`;}).join('');
  }

  function openModal(id){
    const p=PRODUCTS.find(x=>x.id===id); if(!p)return; mvId=id; mvQty=1;
    document.getElementById('mvImg').src='img/'+p.img;
    document.getElementById('mvCat').textContent=p.cat;
    document.getElementById('mvName').textContent=p.name;
    document.getElementById('mvRating').innerHTML=`<span style="color:var(--gold)">${stars(p.rating)}</span> ${p.rating} <small>· ${p.reviews} reviews</small>`;
    document.getElementById('mvPrice').textContent=money(p.price);
    document.getElementById('mvDesc').textContent=p.desc;
    document.getElementById('mvSpecs').innerHTML=Object.entries(p.specs).map(([k,v])=>`<li><span>${k}</span><span>${v}</span></li>`).join('');
    document.getElementById('mvQty').textContent=mvQty;
    document.getElementById('modal').classList.add('on');
  }
  function closeModal(){document.getElementById('modal').classList.remove('on');}

  // wire grid clicks (quick-view or add)
  function initGrid(grid){
    grid.addEventListener('click',e=>{
      const add=e.target.closest('[data-add]');
      if(add){e.stopPropagation();addToCart(+add.dataset.add);return;}
      const card=e.target.closest('.prod'); if(card)openModal(+card.dataset.id);
    });
  }

  function initCartAndModal(){
    // modal controls
    const modal=document.getElementById('modal');
    document.getElementById('modalClose').onclick=closeModal;
    modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
    document.getElementById('mvMinus').onclick=()=>{mvQty=Math.max(1,mvQty-1);document.getElementById('mvQty').textContent=mvQty;};
    document.getElementById('mvPlus').onclick=()=>{mvQty++;document.getElementById('mvQty').textContent=mvQty;};
    document.getElementById('mvAdd').onclick=()=>{addToCart(mvId,mvQty);closeModal();};
    // cart item controls
    const items=document.getElementById('cartItems');
    items.addEventListener('click',e=>{
      const q=e.target.closest('[data-q]'); const rm=e.target.closest('[data-rm]');
      if(q){const[id,d]=q.dataset.q.split('|');changeQty(+id,+d);}
      if(rm)removeItem(+rm.dataset.rm);
    });
    renderCart();
    // drawer
    const overlay=document.getElementById('overlay'), drawer=document.getElementById('cartDrawer');
    const openCart=()=>{drawer.classList.add('on');overlay.classList.add('on');};
    const closeCart=()=>{drawer.classList.remove('on');overlay.classList.remove('on');};
    document.getElementById('cartBtn').onclick=openCart;
    document.getElementById('cartClose').onclick=closeCart;
    overlay.onclick=closeCart;
    document.getElementById('checkoutBtn').onclick=()=>{
      if(!cart.length){toast('Your bag is empty');return;}
      toast('Order placed — thank you! (demo)'); cart=[]; renderCart(); setTimeout(closeCart,800);
    };
    addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeCart();}});
  }

  return {cardHTML,initGrid,initCartAndModal,addToCart,openModal};
})();
