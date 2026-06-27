    // =================== ORDERING ENGINE ===================
    const money=n=>'$'+n.toFixed(2);
    // full product list (menu dishes + 8 deal items)
    const ITEMS=[
      {id:'m1',name:'The Ember Burger',cat:'Mains',img:'d1.jpg',price:24},
      {id:'m2',name:'Cedar Seared Salmon',cat:'Seafood',img:'d3.jpg',price:32},
      {id:'m3',name:'Truffle Tagliatelle',cat:'Pasta',img:'d2.jpg',price:18},
      {id:'m4',name:'Molten Dark Chocolate',cat:'Dessert',img:'d4.jpg',price:14},
      {id:'r1',name:'BBQ Chicken Pizza',cat:'Pizza',img:'r1.jpg',price:16, was:22, offer:'30% OFF', rating:4.5},
      {id:'r2',name:'Loaded Nachos',cat:'Starters',img:'r2.jpg',price:9, was:14, offer:'BUY 1 GET 1', rating:4.3},
      {id:'r3',name:'Crispy Fried Chicken',cat:'Chicken',img:'r3.jpg',price:12, was:18, offer:'33% OFF', rating:4.6},
      {id:'r4',name:'Spicy Tacos',cat:'Mexican',img:'r4.jpg',price:11, was:15, offer:'FLAT $4 OFF', rating:4.4},
      {id:'r5',name:'Classic Cheeseburger',cat:'Burgers',img:'r5.jpg',price:10, was:15, offer:'33% OFF', rating:4.7},
      {id:'r6',name:'Pepperoni Slice Box',cat:'Pizza',img:'r6.jpg',price:13, was:19, offer:'COMBO DEAL', rating:4.5},
      {id:'r7',name:'Golden Fries Basket',cat:'Sides',img:'r7.jpg',price:6, was:9, offer:'FREE DIP', rating:4.2},
      {id:'r8',name:'Hot Wings Platter',cat:'Chicken',img:'r8.jpg',price:14, was:20, offer:'30% OFF', rating:4.8},
    ];
    const byId=id=>ITEMS.find(x=>x.id===id);

    let cart=[];        // {id, qty}
    let favs=new Set(); window.__favs=favs; // ids (exposed for other pages)

    // ---- build deals loop (8 r-items, duplicated for seamless scroll) ----
    (function(){
      const deals=ITEMS.filter(x=>x.id[0]==='r');
      const card=d=>`
        <div class="deal" data-id="${d.id}">
          <div class="ph"><span class="offer">${d.offer}</span>
            <button class="heart" data-fav="${d.id}"><span class="msi">favorite</span></button>
            <img src="img/${d.img}" alt="${d.name}" width="300" height="225" loading="lazy" decoding="async"></div>
          <div class="body">
            <h3>${d.name}</h3><div class="cat">${d.cat}</div>
            <span class="rate">${d.rating} <span class="msi">star</span></span>
            <div class="priceline">
              <div><span class="now">${money(d.price)}</span><span class="was">${money(d.was)}</span></div>
              <button class="addbtn" data-add="${d.id}">Add +</button>
            </div>
          </div>
        </div>`;
      const dt=document.getElementById('dealTrack');
      if(dt)dt.innerHTML=deals.map(card).join('').repeat(2); // duplicate for seamless loop
    })();

    // ---- cart ----
    const $=id=>document.getElementById(id);
    function addToCart(id){const e=cart.find(c=>c.id===id);if(e)e.qty++;else cart.push({id,qty:1});renderCart();toast(`<span class="msi">check_circle</span> ${byId(id).name} added`);bump('cartBadge');}
    function chgQty(id,d){const c=cart.find(x=>x.id===id);if(!c)return;c.qty+=d;if(c.qty<=0)cart=cart.filter(x=>x.id!==id);renderCart();}
    function rmCart(id){cart=cart.filter(x=>x.id!==id);renderCart();}
    function cartCount(){return cart.reduce((s,c)=>s+c.qty,0);}
    function cartSubtotal(){return cart.reduce((s,c)=>s+c.qty*byId(c.id).price,0);}
    function renderCart(){
      const n=cartCount(); const badge=$('cartBadge');
      badge.textContent=n; badge.hidden=n===0;
      const body=$('cartBody');
      if(!cart.length){body.innerHTML='<div class="drawer-empty"><span class="msi" style="font-size:2.4rem;color:var(--faint)">remove_shopping_cart</span><br><br>Your cart is empty.<br>Add something delicious!</div>';$('cartFoot').style.display='none';return;}
      $('cartFoot').style.display='block';
      body.innerHTML=cart.map(c=>{const p=byId(c.id);return `
        <div class="ci"><img src="img/${p.img}" alt="${p.name}">
          <div class="info"><h4>${p.name}</h4><div class="p">${money(p.price)}</div>
            <div class="qty"><button data-q="${p.id}|-1">−</button><span>${c.qty}</span><button data-q="${p.id}|1">+</button></div>
          </div>
          <button class="rm" data-rm="${p.id}"><span class="msi">delete</span></button>
        </div>`;}).join('');
      const sub=cartSubtotal(), del=cart.length?2.99:0, tax=sub*0.05;
      $('cartSub').textContent=money(sub); $('cartDel').textContent=money(del);
      $('cartTax').textContent=money(tax); $('cartTotal').textContent=money(sub+del+tax);
    }
    // ---- favourites ----
    function toggleFav(id){if(favs.has(id))favs.delete(id);else{favs.add(id);toast('<span class="msi">favorite</span> Added to favourites');}
      const b=$('favBadge');b.textContent=favs.size;b.hidden=favs.size===0;
      document.querySelectorAll(`[data-fav="${id}"]`).forEach(h=>h.classList.toggle('on',favs.has(id)));
      renderFavs();bump('favBadge');}
    function renderFavs(){
      const body=$('favBody');
      if(!favs.size){body.innerHTML='<div class="drawer-empty"><span class="msi" style="font-size:2.4rem;color:var(--faint)">favorite_border</span><br><br>No favourites yet.<br>Tap the heart on any dish.</div>';return;}
      body.innerHTML=[...favs].map(id=>{const p=byId(id);return `
        <div class="ci"><img src="img/${p.img}" alt="${p.name}">
          <div class="info"><h4>${p.name}</h4><div class="p">${money(p.price)}</div>
            <button class="fi-add" data-add="${p.id}">Add to cart</button>
          </div>
          <button class="rm" data-fav="${p.id}"><span class="msi">close</span></button>
        </div>`;}).join('');
    }
    function bump(id){const b=$(id);if(b&&b.animate)b.animate([{transform:'scale(1)'},{transform:'scale(1.6)'},{transform:'scale(1)'}],{duration:340});}

    // ---- global click delegation for add/fav/qty/rm ----
    document.addEventListener('click',e=>{
      const add=e.target.closest('[data-add]'); if(add){e.preventDefault();e.stopPropagation();addToCart(add.dataset.add);return;}
      const fav=e.target.closest('[data-fav]'); if(fav){e.preventDefault();e.stopPropagation();toggleFav(fav.dataset.fav);return;}
      const q=e.target.closest('[data-q]'); if(q){const[id,d]=q.dataset.q.split('|');chgQty(id,+d);return;}
      const rm=e.target.closest('[data-rm]'); if(rm){rmCart(rm.dataset.rm);return;}
    });

    // ---- drawers / backdrop ----
    // safe binder: no-op if element missing (so this engine works on any page)
    const on=(id,ev,fn)=>{const el=$(id);if(el)el['on'+ev]=fn;};
    const backdrop=$('backdrop');
    function openDrawer(d){closeAll();$(d).classList.add('on');backdrop.classList.add('on');document.body.style.overflow='hidden';}
    function closeAll(){document.querySelectorAll('.drawer.on,.modal.on').forEach(x=>x.classList.remove('on'));if(backdrop)backdrop.classList.remove('on');const sp=$('searchPanel');if(sp)sp.classList.remove('on');document.body.style.overflow='';}
    on('cartBtn','click',()=>{renderCart();openDrawer('cartDrawer');});
    on('favBtn','click',()=>{renderFavs();openDrawer('favDrawer');});
    if(backdrop)backdrop.onclick=closeAll;
    document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeAll));
    addEventListener('keydown',e=>{if(e.key==='Escape')closeAll();});

    // ---- search ----
    on('searchBtn','click',()=>{$('searchPanel').classList.add('on');setTimeout(()=>$('searchInput').focus(),100);renderSearch('');});
    on('searchClose','click',closeAll);
    if($('searchInput'))$('searchInput').addEventListener('input',e=>renderSearch(e.target.value));
    function renderSearch(q){
      const res=$('searchResults'); if(!res)return;
      const list=ITEMS.filter(x=>(x.name+' '+x.cat).toLowerCase().includes(q.toLowerCase()));
      if(!list.length){res.innerHTML='<div class="sr-empty">No dishes match "'+q+'".</div>';return;}
      res.innerHTML=list.map(p=>`
        <div class="sr-item" data-add="${p.id}"><img src="img/${p.img}" alt="${p.name}">
          <div style="flex:1"><h4>${p.name}</h4><div style="color:var(--faint);font-size:.8rem">${p.cat}</div></div>
          <div class="p">${money(p.price)}</div></div>`).join('');
    }

    // ---- checkout flow ----
    function gotoPane(modal,n){
      modal.querySelectorAll('.cpane').forEach(p=>p.classList.toggle('on',+p.dataset.pane===n));
      modal.querySelectorAll('.cstep').forEach((s,i)=>s.classList.toggle('on',i<=n-1));
    }
    on('checkoutBtn','click',()=>{
      if(!cart.length){toast('Your cart is empty');return;}
      const m=$('checkoutModal'); openModal(m); gotoPane(m,1);
      const sub=cartSubtotal(),del=2.99,tax=sub*0.05,tot=sub+del+tax;
      $('coSummary').innerHTML=cart.map(c=>{const p=byId(c.id);return `<div class="l"><span>${c.qty}× ${p.name}</span><span>${money(c.qty*p.price)}</span></div>`}).join('')
        +`<div class="l"><span>Delivery + tax</span><span>${money(del+tax)}</span></div><div class="l t"><span>Total</span><span>${money(tot)}</span></div>`;
      $('coPay').textContent=money(tot);
    });
    on('coNext1','click',()=>{if(!$('coName').value||!$('coPhone').value||!$('coAddr').value){toast('Please fill all details');return;}gotoPane($('checkoutModal'),2);});
    on('coBack','click',()=>gotoPane($('checkoutModal'),1));
    on('coPlace','click',()=>{gotoPane($('checkoutModal'),3);$('coOrderId').textContent=Math.floor(100000+Math.abs(Math.sin(cart.length+1)*899999));cart=[];renderCart();});
    function openModal(m){closeAll();m.classList.add('on');backdrop.classList.add('on');document.body.style.overflow='hidden';}

    // ---- reservation flow ----
    let resState={guests:'2',slot:'7:30 PM',date:''};
    if($('rGuests')){
      $('rGuests').innerHTML=['1','2','3','4','5','6+'].map((g)=>`<button class="chip${g==='2'?' on':''}" data-g="${g}">${g} guest${g==='1'?'':'s'}</button>`).join('');
      $('rSlots').innerHTML=['5:30 PM','6:30 PM','7:30 PM','8:30 PM','9:30 PM'].map(s=>`<button class="chip${s==='7:30 PM'?' on':''}" data-s="${s}">${s}</button>`).join('');
      $('rGuests').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;$('rGuests').querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));b.classList.add('on');resState.guests=b.dataset.g;});
      $('rSlots').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;$('rSlots').querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));b.classList.add('on');resState.slot=b.dataset.s;});
    }
    function openRes(){const m=$('resModal');if(!m){location.href='index.html#book';return;}openModal(m);gotoPane(m,1);}
    on('openResBtn','click',openRes);
    document.querySelectorAll('a[href="#book"]').forEach(a=>a.addEventListener('click',e=>{if($('resModal')){e.preventDefault();openRes();}}));
    on('rNext1','click',()=>{
      resState.date=$('rDate').value||'your selected date';
      $('rRecap').innerHTML=`<strong>${resState.guests}</strong> guests · <strong>${resState.date}</strong> · <strong>${resState.slot}</strong>`;
      gotoPane($('resModal'),2);
    });
    on('rBack','click',()=>gotoPane($('resModal'),1));
    on('rConfirm','click',()=>{
      if(!$('rName').value||!$('rPhone').value){toast('Please add your name and phone');return;}
      gotoPane($('resModal'),3);
      $('rConfirmText').innerHTML=`Table for <strong>${resState.guests}</strong> on <strong>${resState.date}</strong> at <strong>${resState.slot}</strong>.`;
      $('rBookingId').textContent=Math.floor(10000+Math.abs(Math.cos($('rName').value.length+1)*89999));
    });

    renderCart();
