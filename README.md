# Realtime Collaborative Whiteboard

![Status: Active](https://img.shields.io/badge/status-active-success.svg) ![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg) ![Node](https://img.shields.io/badge/node-%3E%3D14.0-green.svg)

A modern, real-time collaborative whiteboard for drawing, sketching and brainstorming together — built with HTML5 Canvas, Socket.IO and Node.js.

> Lightweight, responsive, and made for remote teams, classrooms, and creative sessions.

---

## ✨ Key Features

* **Real-time collaboration** — simultaneous drawing with low-latency sync
* **Drawing tools** — freehand pen, line, arrow, rectangle, circle, text and eraser
* **Customization** — color picker, adjustable brush sizes and stroke widths
* **Canvas controls** — undo/redo, clear canvas, save/export as PNG
* **Responsive UI** — desktop, tablet and mobile friendly
* **Room-ready** — shareable room URL for quick collaboration

> ⚠️ *Note:* The feature to merge or execute *another user’s code* inside the board (code-collaboration/execution) is still a work-in-progress.

---

## 📦 Tech Stack

**Frontend**: HTML5 Canvas, Vanilla JavaScript, CSS3

**Backend**: Node.js, Express, Socket.IO

**Optional**: Redis (for scaling / pub-sub), Nginx (reverse proxy)

---

## 🚀 Quick Start (Development)

1. Clone the repo

```bash
git clone https://github.com/sasi-9393/Realtime-Collaborative-whiteboard.git
cd Realtime-Collaborative-whiteboard
```

2. Install dependencies

```bash
npm install
```

3. Copy env example and edit if needed

```bash
cp .env.example .env
# set PORT or other variables if required
```

4. Start the server

```bash
npm start
```

5. Open the app

```
http://localhost:3000
```

---

## ⚙️ Project Structure

```
Realtime-Collaborative-whiteboard/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── canvas.js
│   └── index.html
├── server/
│   └── server.js
├── package.json
├── .env.example
└── README.md
```

---

## 🔌 Socket API (Events)

### Client → Server

* `join-room` — join a specific room (payload: `{ roomId, userId?, userName? }`)
* `drawing` — emits drawing data (normalized coordinates, color, width, tool)
* `clear-canvas` — request to clear the canvas for the room
* `undo` / `redo` — request history actions
* `cursor-move` — (optional) broadcast cursor position for collaborative cursor

### Server → Client

* `drawing` — broadcasted drawing data from other users
* `user-joined` — notification when a user joins a room
* `user-left` — notification when a user leaves
* `clear-canvas` — instruct clients to clear their canvas
* `history` — send canvas history on join

> Tip: keep `drawing` payloads small (batch points, quantize coordinates) to reduce bandwidth.

---





---

## ♻️ Roadmap / Planned Improvements

* [x] Core real-time whiteboard with drawing tools
* [ ] Room management (create / list / private rooms)
* [ ] Chat integration
* [ ] Image upload & background images
* [ ] More shapes (polygon, bezier curves)
* [ ] Auth & user profiles
* [ ] Collaborative cursors and user presence indicators
* [ ] Canvas versioning & persistent history snapshots
* [ ] Performance improvements for very large canvases

---

## 👩‍💻 Contributing

Contributions, issues and feature requests are welcome.

1. Fork the project
2. Create a branch: `git checkout -b feature/awesome`
3. Commit your changes: `git commit -m "Add awesome feature"`
4. Push to the branch: `git push origin feature/awesome`
5. Open a Pull Request

Please follow the existing code style and include tests or a demo when relevant.


## 📄 License

This project is released under the **MIT License**. See the `LICENSE` file for details.

---

## 👤 Author

**Sasi** — [sasi-9393 (GitHub)](https://github.com/sasi-9393)

---

If you want, I can also generate a shorter `README-short.md` (one-page quickstart), a `CONTRIBUTING.md`, or example `.env` and `Procfile` for deployment.
