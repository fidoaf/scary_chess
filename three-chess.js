/**
 * Three.js 3D Chess Renderer
 * Renders a 3D chessboard with Staunton-style pieces using lathe geometry.
 */
const ChessRenderer3D = (() => {
    'use strict';

    let scene, camera, renderer, raycaster, mouse;
    let boardGroup, piecesGroup;
    let squareMeshes = [];   // 64 meshes for click detection
    let pieceMeshes = [];    // current piece meshes on board
    let containerEl = null;
    let onSquareClickCb = null;
    let animFrameId = null;
    let isInitialized = false;
    let needsRender = true;

    // Board colors matching chess.com green theme
    const LIGHT_SQ = 0xeeeed2;
    const DARK_SQ = 0x769656;
    const SELECTED_SQ = 0xf6f669;
    const LAST_MOVE_SQ = 0xbaca44;
    const LEGAL_MOVE_SQ = 0x646446;
    const CHECK_SQ = 0xcc3333;
    const BOARD_EDGE = 0x6b5436;
    const BOARD_EDGE_DARK = 0x4a3822;

    // Piece material colors
    const WHITE_PIECE = { color: 0xf0ece0, specular: 0x444444, shininess: 60 };
    const BLACK_PIECE = { color: 0x222222, specular: 0x666666, shininess: 80 };

    const SQ_SIZE = 1;
    const BOARD_SIZE = SQ_SIZE * 8;
    const HALF = BOARD_SIZE / 2;

    // ---- Piece Profiles (lathe cross-sections) ----
    // Each profile is an array of [x, y] points forming the right-side outline
    // that gets revolved around Y axis. y=0 is the base.

    function pawnProfile() {
        return [
            [0, 0], [0.38, 0], [0.4, 0.02], [0.4, 0.08], [0.38, 0.1],
            [0.32, 0.1], [0.34, 0.14], [0.36, 0.18],
            [0.36, 0.22], [0.34, 0.26],
            [0.2, 0.32], [0.18, 0.36],
            [0.22, 0.4], [0.25, 0.48], [0.24, 0.56],
            [0.2, 0.62], [0.14, 0.66], [0.08, 0.68],
            [0, 0.7],
        ];
    }

    function rookProfile() {
        return [
            [0, 0], [0.42, 0], [0.44, 0.02], [0.44, 0.08], [0.42, 0.1],
            [0.34, 0.1], [0.36, 0.14], [0.38, 0.18],
            [0.3, 0.18], [0.3, 0.22], [0.32, 0.24],
            [0.32, 0.6], [0.34, 0.62],
            [0.36, 0.62], [0.36, 0.7], [0.32, 0.7],
            [0.32, 0.74], [0.36, 0.74], [0.36, 0.82],
            [0.22, 0.82], [0.22, 0.74], [0.26, 0.74],
            [0.26, 0.7], [0.22, 0.7], [0.22, 0.62],
            [0.24, 0.62], [0.26, 0.6],
            [0, 0.6],
        ];
    }

    function knightProfile() {
        // Knight can't be a perfect lathe, so we use a wider body profile
        // and add a head as a separate geometry
        return [
            [0, 0], [0.42, 0], [0.44, 0.02], [0.44, 0.08], [0.42, 0.1],
            [0.34, 0.1], [0.36, 0.14], [0.38, 0.18],
            [0.3, 0.18], [0.3, 0.22], [0.32, 0.24],
            [0.3, 0.3], [0.26, 0.38], [0.22, 0.5],
            [0.2, 0.6], [0.18, 0.7], [0.14, 0.78],
            [0, 0.82],
        ];
    }

    function bishopProfile() {
        return [
            [0, 0], [0.38, 0], [0.4, 0.02], [0.4, 0.08], [0.38, 0.1],
            [0.3, 0.1], [0.32, 0.14], [0.34, 0.18],
            [0.26, 0.18], [0.26, 0.22], [0.28, 0.24],
            [0.22, 0.3], [0.18, 0.38],
            [0.22, 0.48], [0.24, 0.56], [0.22, 0.66],
            [0.16, 0.76], [0.1, 0.82], [0.05, 0.86],
            [0, 0.88],
        ];
    }

    function queenProfile() {
        return [
            [0, 0], [0.42, 0], [0.44, 0.02], [0.44, 0.08], [0.42, 0.1],
            [0.34, 0.1], [0.36, 0.14], [0.38, 0.18],
            [0.28, 0.18], [0.28, 0.22], [0.3, 0.24],
            [0.24, 0.32], [0.2, 0.42],
            [0.24, 0.52], [0.26, 0.62], [0.24, 0.72],
            [0.18, 0.82], [0.12, 0.88],
            [0.16, 0.92], [0.12, 0.96],
            [0.06, 0.98], [0, 1.0],
        ];
    }

    function kingProfile() {
        return [
            [0, 0], [0.42, 0], [0.44, 0.02], [0.44, 0.08], [0.42, 0.1],
            [0.34, 0.1], [0.36, 0.14], [0.38, 0.18],
            [0.28, 0.18], [0.28, 0.22], [0.3, 0.24],
            [0.24, 0.32], [0.2, 0.42],
            [0.24, 0.52], [0.28, 0.62], [0.26, 0.72],
            [0.2, 0.82], [0.14, 0.9],
            [0.08, 0.94], [0, 0.96],
        ];
    }

    const PIECE_PROFILES = {
        1: pawnProfile,   // pawn
        2: knightProfile, // knight
        3: bishopProfile, // bishop
        4: rookProfile,   // rook
        5: queenProfile,  // queen
        6: kingProfile,   // king
    };

    const PIECE_HEIGHTS = {
        1: 0.55,  // pawn
        2: 0.7,   // knight
        3: 0.75,  // bishop
        4: 0.65,  // rook
        5: 0.85,  // queen
        6: 0.95,  // king
    };

    const PIECE_SCALES = {
        1: 0.7,
        2: 0.75,
        3: 0.72,
        4: 0.78,
        5: 0.78,
        6: 0.8,
    };

    // ---- Geometry Creation ----

    function createLatheGeometry(profileFn, height, scale) {
        const points = profileFn();
        const vectors = points.map(([x, y]) => new THREE.Vector2(x * scale, y * height));
        return new THREE.LatheGeometry(vectors, 24);
    }

    function createCross(height, scale) {
        const armW = 0.06 * scale;
        const armH = 0.18 * height;
        const crossH = 0.12 * height;
        const group = new THREE.Group();

        const vGeo = new THREE.BoxGeometry(armW * 2, armH, armW * 2);
        const hGeo = new THREE.BoxGeometry(armW * 5, crossH * 0.6, armW * 2);

        const mat = new THREE.MeshPhongMaterial({ color: 0xc0b080, specular: 0x333333, shininess: 40 });

        const vMesh = new THREE.Mesh(vGeo, mat);
        vMesh.position.y = height * 0.96 + armH / 2;

        const hMesh = new THREE.Mesh(hGeo, mat);
        hMesh.position.y = height * 0.96 + armH * 0.55;

        group.add(vMesh);
        group.add(hMesh);
        return group;
    }

    function createBishopBall(height, scale) {
        const geo = new THREE.SphereGeometry(0.06 * scale, 16, 12);
        const mat = new THREE.MeshPhongMaterial({ color: 0xc0b080, specular: 0x444444, shininess: 50 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = height + 0.02;
        return mesh;
    }

    function createQueenBall(height, scale) {
        const geo = new THREE.SphereGeometry(0.055 * scale, 16, 12);
        const mat = new THREE.MeshPhongMaterial({ color: 0xc0b080, specular: 0x444444, shininess: 50 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = height + 0.015;
        return mesh;
    }

    function createKnightHead(isWhite, height, scale) {
        // Approximate horse head with a tilted box + snout
        const headMat = new THREE.MeshPhongMaterial(isWhite ? WHITE_PIECE : BLACK_PIECE);
        const group = new THREE.Group();

        // Main head block
        const headGeo = new THREE.BoxGeometry(0.22 * scale, 0.3 * height, 0.28 * scale);
        headGeo.translate(0, 0, 0);
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, height * 0.7, 0.08 * scale);
        head.rotation.x = -0.3;
        group.add(head);

        // Snout
        const snoutGeo = new THREE.BoxGeometry(0.16 * scale, 0.12 * height, 0.2 * scale);
        const snout = new THREE.Mesh(snoutGeo, headMat);
        snout.position.set(0, height * 0.58, 0.18 * scale);
        snout.rotation.x = -0.15;
        group.add(snout);

        // Ears
        const earGeo = new THREE.ConeGeometry(0.04 * scale, 0.1 * height, 4);
        const earL = new THREE.Mesh(earGeo, headMat);
        earL.position.set(-0.06 * scale, height * 0.88, 0.06 * scale);
        group.add(earL);
        const earR = new THREE.Mesh(earGeo, headMat);
        earR.position.set(0.06 * scale, height * 0.88, 0.06 * scale);
        group.add(earR);

        return group;
    }

    // Create piece mesh
    function createPiece(pieceType, isWhite) {
        const profile = PIECE_PROFILES[pieceType];
        const height = PIECE_HEIGHTS[pieceType];
        const scale = PIECE_SCALES[pieceType];

        const mat = new THREE.MeshPhongMaterial(isWhite ? WHITE_PIECE : BLACK_PIECE);
        const group = new THREE.Group();

        // Main body
        const bodyGeo = createLatheGeometry(profile, height, scale);
        const bodyMesh = new THREE.Mesh(bodyGeo, mat);
        group.add(bodyMesh);

        // Extra parts
        if (pieceType === 6) { // King - add cross
            const cross = createCross(height, scale);
            // Match cross color to piece
            cross.children.forEach(c => {
                c.material = new THREE.MeshPhongMaterial(
                    isWhite ? { color: 0xd8d0b8, specular: 0x444444, shininess: 40 }
                            : { color: 0x444444, specular: 0x666666, shininess: 60 }
                );
            });
            group.add(cross);
        } else if (pieceType === 3) { // Bishop - ball on top
            const ball = createBishopBall(height, scale);
            ball.material = new THREE.MeshPhongMaterial(
                isWhite ? { color: 0xd8d0b8, specular: 0x444444, shininess: 50 }
                        : { color: 0x3a3a3a, specular: 0x666666, shininess: 60 }
            );
            group.add(ball);
        } else if (pieceType === 5) { // Queen - ball on top
            const ball = createQueenBall(height, scale);
            ball.material = new THREE.MeshPhongMaterial(
                isWhite ? { color: 0xd8d0b8, specular: 0x444444, shininess: 50 }
                        : { color: 0x3a3a3a, specular: 0x666666, shininess: 60 }
            );
            group.add(ball);
        } else if (pieceType === 2) { // Knight - add head
            const head = createKnightHead(isWhite, height, scale);
            group.add(head);
        }

        return group;
    }

    // Cache piece geometries
    const pieceCache = {};
    function getCachedPiece(pieceConst) {
        if (!pieceCache[pieceConst]) {
            const isWhite = pieceConst <= 6;
            const type = isWhite ? pieceConst : pieceConst - 6;
            pieceCache[pieceConst] = createPiece(type, isWhite);
        }
        return pieceCache[pieceConst].clone();
    }

    // ---- Board Creation ----

    function buildBoard() {
        boardGroup = new THREE.Group();

        // Board slab
        const slabGeo = new THREE.BoxGeometry(BOARD_SIZE + 0.6, 0.2, BOARD_SIZE + 0.6);
        const slabMat = new THREE.MeshPhongMaterial({ color: BOARD_EDGE, specular: 0x222222, shininess: 20 });
        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.y = -0.1;
        boardGroup.add(slab);

        // Dark edge strip under the slab
        const edgeGeo = new THREE.BoxGeometry(BOARD_SIZE + 0.7, 0.08, BOARD_SIZE + 0.7);
        const edgeMat = new THREE.MeshPhongMaterial({ color: BOARD_EDGE_DARK, specular: 0x111111, shininess: 10 });
        const edge = new THREE.Mesh(edgeGeo, edgeMat);
        edge.position.y = -0.24;
        boardGroup.add(edge);

        // Squares
        squareMeshes = [];
        const sqGeo = new THREE.PlaneGeometry(SQ_SIZE, SQ_SIZE);

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const isLight = (r + c) % 2 === 0;
                const mat = new THREE.MeshPhongMaterial({
                    color: isLight ? LIGHT_SQ : DARK_SQ,
                    specular: 0x111111,
                    shininess: 10,
                });
                const sq = new THREE.Mesh(sqGeo, mat);
                sq.rotation.x = -Math.PI / 2;
                sq.position.set(
                    (c - 3.5) * SQ_SIZE,
                    0.001,
                    (r - 3.5) * SQ_SIZE
                );
                sq.userData = { row: r, col: c };
                boardGroup.add(sq);
                squareMeshes.push(sq);
            }
        }

        scene.add(boardGroup);
    }

    // ---- Update Board State ----

    function getSquareColor(r, c, highlights) {
        if (highlights.selected && highlights.selected.r === r && highlights.selected.c === c) {
            return SELECTED_SQ;
        }
        if (highlights.lastMove) {
            const lm = highlights.lastMove;
            if ((r === lm.from.r && c === lm.from.c) || (r === lm.to.r && c === lm.to.c)) {
                return LAST_MOVE_SQ;
            }
        }
        if (highlights.checkPos && highlights.checkPos.r === r && highlights.checkPos.c === c) {
            return CHECK_SQ;
        }
        if (highlights.legalMoves && highlights.legalMoves.some(m => m.to.r === r && m.to.c === c)) {
            return LEGAL_MOVE_SQ;
        }
        return (r + c) % 2 === 0 ? LIGHT_SQ : DARK_SQ;
    }

    function updateBoard(boardState, highlights) {
        if (!isInitialized) return;

        // Update square colors
        for (let i = 0; i < squareMeshes.length; i++) {
            const sq = squareMeshes[i];
            const { row, col } = sq.userData;
            const color = getSquareColor(row, col, highlights);
            sq.material.color.setHex(color);
        }

        // Clear old pieces
        if (piecesGroup) {
            scene.remove(piecesGroup);
            piecesGroup.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                    else child.material.dispose();
                }
            });
        }
        piecesGroup = new THREE.Group();

        // Place pieces
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = boardState[r * 8 + c];
                if (piece === 0) continue;

                const mesh = getCachedPiece(piece);
                mesh.position.set(
                    (c - 3.5) * SQ_SIZE,
                    0.001,
                    (r - 3.5) * SQ_SIZE
                );
                mesh.userData = { row: r, col: c };
                piecesGroup.add(mesh);
            }
        }

        scene.add(piecesGroup);

        // Add legal move indicators (small spheres)
        if (highlights.legalMoves) {
            highlights.legalMoves.forEach(m => {
                const target = boardState[m.to.r * 8 + m.to.c];
                const indicatorGeo = target !== 0 || m.enPassant
                    ? new THREE.RingGeometry(0.35, 0.45, 24)
                    : new THREE.CircleGeometry(0.12, 16);
                const indicatorMat = new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    transparent: true,
                    opacity: 0.25,
                    side: THREE.DoubleSide,
                });
                const indicator = new THREE.Mesh(indicatorGeo, indicatorMat);
                indicator.rotation.x = -Math.PI / 2;
                indicator.position.set(
                    (m.to.c - 3.5) * SQ_SIZE,
                    0.005,
                    (m.to.r - 3.5) * SQ_SIZE
                );
                piecesGroup.add(indicator);
            });
        }

        needsRender = true;
    }

    // ---- Init / Destroy ----

    function init(container, clickCallback) {
        containerEl = container;
        onSquareClickCb = clickCallback;

        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x302e2b);

        // Camera - angled view like chess.com
        camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 10.5, 8);
        camera.lookAt(0, 0, 1.2);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerEl.appendChild(renderer.domElement);

        // Lighting - strong directional from upper left + soft ambient + fill
        const ambient = new THREE.AmbientLight(0xffffff, 0.45);
        scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(-4, 10, 5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 30;
        dirLight.shadow.camera.left = -6;
        dirLight.shadow.camera.right = 6;
        dirLight.shadow.camera.top = 6;
        dirLight.shadow.camera.bottom = -6;
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0xffeedd, 0.25);
        fillLight.position.set(5, 6, -3);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xaaccff, 0.15);
        rimLight.position.set(0, 3, -8);
        scene.add(rimLight);

        // Raycaster for click detection
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Build board
        buildBoard();

        // Events
        renderer.domElement.addEventListener('click', onCanvasClick);
        window.addEventListener('resize', onResize);

        // Size
        onResize();
        isInitialized = true;

        // Render loop
        animate();
    }

    function destroy() {
        isInitialized = false;
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
        if (renderer) {
            renderer.domElement.removeEventListener('click', onCanvasClick);
            window.removeEventListener('resize', onResize);
            if (containerEl && renderer.domElement.parentNode === containerEl) {
                containerEl.removeChild(renderer.domElement);
            }
            renderer.dispose();
        }
        // Clear caches
        Object.keys(pieceCache).forEach(k => delete pieceCache[k]);
        scene = null;
        camera = null;
        renderer = null;
        squareMeshes = [];
        pieceMeshes = [];
        piecesGroup = null;
        boardGroup = null;
    }

    function animate() {
        animFrameId = requestAnimationFrame(animate);
        if (needsRender) {
            renderer.render(scene, camera);
            needsRender = false;
        }
    }

    function onResize() {
        if (!containerEl || !renderer) return;
        const parent = containerEl.parentElement;
        // Match the CSS board size
        const sqVar = getComputedStyle(document.documentElement).getPropertyValue('--sq').trim();
        let sqPx = 60;
        if (sqVar) {
            // Parse the min() or px value
            const tempEl = document.createElement('div');
            tempEl.style.width = sqVar;
            document.body.appendChild(tempEl);
            sqPx = tempEl.getBoundingClientRect().width || 60;
            document.body.removeChild(tempEl);
        }
        const size = Math.round(sqPx * 8);
        const height = Math.round(size * 1.1);
        containerEl.style.width = size + 'px';
        containerEl.style.height = height + 'px';
        renderer.setSize(size, height);
        camera.aspect = size / height;
        camera.updateProjectionMatrix();
        needsRender = true;
    }

    function onCanvasClick(event) {
        if (!onSquareClickCb) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Check pieces first
        if (piecesGroup) {
            const pieceHits = raycaster.intersectObjects(piecesGroup.children, true);
            if (pieceHits.length > 0) {
                // Walk up to find the group with userData
                let obj = pieceHits[0].object;
                while (obj && (!obj.userData || obj.userData.row === undefined)) {
                    obj = obj.parent;
                }
                if (obj && obj.userData && obj.userData.row !== undefined) {
                    onSquareClickCb(obj.userData.row, obj.userData.col);
                    return;
                }
            }
        }

        // Then check squares
        const sqHits = raycaster.intersectObjects(squareMeshes);
        if (sqHits.length > 0) {
            const { row, col } = sqHits[0].object.userData;
            onSquareClickCb(row, col);
        }
    }

    return {
        init,
        destroy,
        updateBoard,
        resize: onResize,
        isActive: () => isInitialized,
    };
})();
