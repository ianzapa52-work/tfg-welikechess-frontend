// friends.ts

interface Friend {
  id: string;
  name: string;
  elo: number;
  avatar: string;
  online: boolean;
  streak: number;
}

interface FriendRequest {
  id: string;
  name: string;
  elo: number;
  avatar: string;
}

const initFriends = (): void => {
  const friendsOnlineList = document.getElementById("friendsOnlineList");
  const friendsAllList = document.getElementById("friendsAllList");
  const friendsRequestsList = document.getElementById("friendsRequestsList");

  // Si no encuentra los contenedores, salimos para no dar error
  if (!friendsOnlineList || !friendsAllList || !friendsRequestsList) return;

  // Limpiamos contenido previo para evitar duplicados en el build
  friendsOnlineList.innerHTML = "";
  friendsAllList.innerHTML = "";
  friendsRequestsList.innerHTML = "";

  const friends: Friend[] = [
    { id: "1", name: "Carlos", elo: 1750, avatar: "/avatars/1.png", online: true, streak: 3 },
    { id: "2", name: "Lucía", elo: 1690, avatar: "/avatars/2.png", online: false, streak: 1 },
    { id: "3", name: "Marcos", elo: 1650, avatar: "/avatars/3.png", online: true, streak: 5 },
    { id: "4", name: "Ana", elo: 1600, avatar: "/avatars/4.png", online: false, streak: 0 },
    { id: "5", name: "Juan", elo: 1600, avatar: "/avatars/5.png", online: false, streak: 0 }
  ];

  const requests: FriendRequest[] = [
    { id: "6", name: "Javier", elo: 1500, avatar: "/avatars/default.png" },
    { id: "7", name: "Sofía",  elo: 1580, avatar: "/avatars/default.png" }
  ];

  const createFriendCard = (friend: Friend): HTMLDivElement => {
    const card = document.createElement("div");
    card.className = "friend-card";
    card.innerHTML = `
      <div class="flex items-center gap-4">
        <img class="w-12 h-12 rounded-full border-2 border-[var(--color-gold)]" src="${friend.avatar}" alt="${friend.name}">
        <div class="flex flex-col">
          <span class="font-bold text-[var(--text-main)]">${friend.name}</span>
          <span class="text-xs opacity-70">${friend.elo} ELO</span>
          <span class="text-[10px] ${friend.online ? 'text-green-500' : 'text-gray-500'}">${friend.online ? "● En línea" : "○ Desconectado"}</span>
        </div>
      </div>
      <button class="friend-btn challenge">Retar</button>
    `;
    return card;
  };

  const createRequestCard = (req: FriendRequest): HTMLDivElement => {
    const card = document.createElement("div");
    card.className = "friend-card";
    card.innerHTML = `
      <div class="flex items-center gap-4">
        <img class="w-10 h-10 rounded-full" src="${req.avatar}" alt="${req.name}">
        <div class="flex flex-col">
          <span class="font-bold text-sm">${req.name}</span>
          <span class="text-xs opacity-70">${req.elo} ELO</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="friend-btn accept">✓</button>
        <button class="friend-btn decline">✕</button>
      </div>
    `;
    return card;
  };

  // Renderizar
  friends.filter(f => f.online).forEach(f => friendsOnlineList.appendChild(createFriendCard(f)));
  friends.forEach(f => friendsAllList.appendChild(createFriendCard(f)));
  requests.forEach(r => friendsRequestsList.appendChild(createRequestCard(r)));
};

// 1. Ejecutar cuando Astro termine de cargar la página (View Transitions)
document.addEventListener('astro:page-load', initFriends);

// 2. Ejecutar inmediatamente si el DOM ya está listo (Carga inicial o sin transiciones)
if (document.readyState !== 'loading') {
  initFriends();
}