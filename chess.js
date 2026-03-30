(() => {
    'use strict';

    // Piece constants
    const EMPTY = 0;
    const W_PAWN = 1, W_KNIGHT = 2, W_BISHOP = 3, W_ROOK = 4, W_QUEEN = 5, W_KING = 6;
    const B_PAWN = 7, B_KNIGHT = 8, B_BISHOP = 9, B_ROOK = 10, B_QUEEN = 11, B_KING = 12;

    const MINECRAFT_LABELS = {
        [EMPTY]: '',
        [W_PAWN]: 'Pig', [W_KNIGHT]: 'Wolf', [W_BISHOP]: 'Villager', [W_ROOK]: 'Iron Golem', [W_QUEEN]: 'Alex', [W_KING]: 'Steve',
        [B_PAWN]: 'Entity 303', [B_KNIGHT]: 'Cursed Villager', [B_BISHOP]: 'Enderman', [B_ROOK]: 'Siren Head', [B_QUEEN]: 'Herobrine', [B_KING]: 'Herobrine',
    };

    const CLASSIC_LABELS = {
        [EMPTY]: '',
        [W_PAWN]: 'White Pawn', [W_KNIGHT]: 'White Knight', [W_BISHOP]: 'White Bishop', [W_ROOK]: 'White Rook', [W_QUEEN]: 'White Queen', [W_KING]: 'White King',
        [B_PAWN]: 'Black Pawn', [B_KNIGHT]: 'Black Knight', [B_BISHOP]: 'Black Bishop', [B_ROOK]: 'Black Rook', [B_QUEEN]: 'Black Queen', [B_KING]: 'Black King',
    };

    // ---- Minecraft Pixel Art Sprites (8x8 face textures) ----
    function generateSprites() {
        const SPRITE_SIZE = 48;
        const sprites = {};

        function renderPixelArt(colorMap, rows) {
            const canvas = document.createElement('canvas');
            canvas.width = SPRITE_SIZE;
            canvas.height = SPRITE_SIZE;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            const numRows = rows.length;
            const numCols = rows[0].length;
            const px = SPRITE_SIZE / numCols;
            const py = SPRITE_SIZE / numRows;
            for (let r = 0; r < numRows; r++) {
                for (let c = 0; c < numCols; c++) {
                    const ch = rows[r][c];
                    if (ch !== '.' && colorMap[ch]) {
                        ctx.fillStyle = colorMap[ch];
                        ctx.fillRect(Math.floor(c * px), Math.floor(r * py), Math.ceil(px), Math.ceil(py));
                    }
                }
            }
            return canvas.toDataURL('image/png');
        }

        // Steve (White King) - brown hair, skin, blue+white eyes, nose, brown beard with mouth
        sprites[W_KING] = renderPixelArt(
            { h: '#4a3728', s: '#c8946e', w: '#ffffff', b: '#2f48cc', B: '#694638', n: '#b07a4e', m: '#956050' },
            [
                'hhhhhhhh',
                'hhsssshh',
                'ssssssss',
                'wbssssbw',
                'sssnnsss',
                'sBssssBs',
                'ssBBBBss',
                'sssBBsss',
            ]
        );

        // Alex (White Queen) - orange hair, pale skin, green+white eyes, nose, pink mouth
        sprites[W_QUEEN] = renderPixelArt(
            { o: '#c46420', l: '#e08030', s: '#f0c8a0', w: '#ffffff', g: '#3a7a20', n: '#d4a878', p: '#e87888' },
            [
                'oolollol',
                'oolllloo',
                'osssssss',
                'wgssssgw',
                'ossnnsss',
                'osssssss',
                'ossppsss',
                'ssssssss',
            ]
        );

        // White Rook - pixel face with full brow, black-red eyes, and long gray nose
        sprites[W_ROOK] = renderPixelArt(
            { s: '#e7d8b3', b: '#9a724f', t: '#7f6044', k: '#060606', r: '#e31414', g: '#9d9d9d', d: '#565656' },
            [
                'ssssssss',
                'ssssssss',
                'bbbttbbb',
                'skksskks',
                'srkggkrs',
                'sbbggbbs',
                'sssggsss',
                'sssddsss',
            ]
        );

        // Wolf (White Knight) - white/grey, dark eyes, nose, red collar
        sprites[W_KNIGHT] = renderPixelArt(
            { e: '#999999', w: '#e0e0e0', d: '#444444', n: '#333333', r: '#dd3333' },
            [
                'ew....we',
                'ewwwwwwe',
                'wdwwwdww',
                'wwwwwwww',
                'wwwnwwww',
                '.rrrrrr.',
                '.wwwwww.',
                '........',
            ]
        );

        // Villager (White Bishop) - no hair, skin face, green eyes, long nose
        sprites[W_BISHOP] = renderPixelArt(
            { s: '#c8946e', t: '#b07a4e', d: '#444444', g: '#3da040', w: '#ffffff', n: '#9a6a3e' },
            [
                'ssssssss',
                'sdddddds',
                'wgsssgws',
                'sssnnsss',
                'sssnnsss',
                'sssnnsss',
                'ssssssss',
                'ssssssss',
            ]
        );

        // Pig (White Pawn) - pink, dark eyes, lighter snout
        sprites[W_PAWN] = renderPixelArt(
            { p: '#e89090', d: '#4a3030', s: '#f0b0b0', n: '#c07070' },
            [
                'pp....pp',
                'pppppppp',
                'pdpppdpp',
                'pppppppp',
                'ppsnnspp',
                'ppsnnspp',
                'pppppppp',
                '........',
            ]
        );

        // Entity 303 (Black Pawn) - white hood with black face and glowing red eyes
        sprites[B_PAWN] = renderPixelArt(
            { w: '#f0f0f0', g: '#cccccc', k: '#050505', r: '#d01515', R: '#ff2a2a' },
            [
                'ggwwwwgg',
                'gwwwwwwg',
                'wwkkkkww',
                'wwkkkkww',
                'wrrkkrrw',
                'wrRkkRrw',
                'wwkkkkww',
                'wwkkkkww',
            ]
        );

        // Cursed Villager (Black Knight) - white eyes, long nose, and deep open mouth
        sprites[B_KNIGHT] = renderPixelArt(
            { s: '#b98a70', h: '#8b5f46', w: '#f2f2f2', n: '#7a4a33', m: '#1a0f0f', r: '#5f473b' },
            [
                'sshhhhss',
                'swwnnwws',
                'sssnnsss',
                'sssnnsss',
                'ssmmmmss',
                'ssmmmmss',
                'rrmmmmrr',
                'rrrrrrrr',
            ]
        );

        // Enderman (Black Bishop) - black, purple eyes
        sprites[B_BISHOP] = renderPixelArt(
            { k: '#1a1a1a', p: '#cc44ff' },
            [
                'kkkkkkkk',
                'kkkkkkkk',
                'kppkkppk',
                'kppkkppk',
                'kkkkkkkk',
                'kkkkkkkk',
                'kkkkkkkk',
                'kkkkkkkk',
            ]
        );

        // Siren Head (Black Rook) - twin siren speakers on a flesh neck silhouette
        sprites[B_ROOK] = renderPixelArt(
            { f: '#8f624a', d: '#5e3f30', k: '#171717', r: '#b11a1a' },
            [
                'kkffffkk',
                'kkrffrkk',
                'kkffffkk',
                'kkfddfkk',
                'kkfddfkk',
                'kkfddfkk',
                'kkfddfkk',
                'kkkffkkk',
            ]
        );

        // Herobrine (Black Queen) - Steve's face but with solid glowing white eyes
        sprites[B_QUEEN] = renderPixelArt(
            { h: '#4a3728', s: '#c8946e', w: '#ffffff', B: '#694638', n: '#b07a4e' },
            [
                'hhhhhhhh',
                'hhsssshh',
                'ssssssss',
                'wwssssww',
                'sssnnsss',
                'sBssssBs',
                'ssBBBBss',
                'sssBBsss',
            ]
        );

        // Herobrine (Black King) - 2 rows of eyes, nose between each pair, short sideburns
        sprites[B_KING] = renderPixelArt(
            { h: '#4a3728', s: '#c8946e', w: '#ffffff', r: '#8b2020', b: '#3b3088', d: '#2a1e1e', n: '#3d2510', m: '#7a5a3e' },
            [
                'hhhhhhhh',
                'hssssssh',
                'swrssbds',
                'ssssssss',
                'swrssbds',
                'ssnssnss',
                'sssmmsss',
                'ssssssss',
            ]
        );

        return sprites;
    }

    function generateClassicSprites() {
        const sprites = {};
        const pieceKinds = {
            [W_PAWN]: 'pawn', [W_KNIGHT]: 'knight', [W_BISHOP]: 'bishop', [W_ROOK]: 'rook', [W_QUEEN]: 'queen', [W_KING]: 'king',
            [B_PAWN]: 'pawn', [B_KNIGHT]: 'knight', [B_BISHOP]: 'bishop', [B_ROOK]: 'rook', [B_QUEEN]: 'queen', [B_KING]: 'king',
        };

        function createClassicSprite(pieceKind, isWhite) {
            const fill = isWhite ? '#f6f2e8' : '#111111';
            const stroke = isWhite ? '#202020' : '#e7dfd0';
            const accent = isWhite ? '#d7c6a4' : '#2d2d2d';

            // Bishop: clean symmetric Staunton silhouette
            if (pieceKind === 'bishop') {
                const detail = isWhite ? '#202020' : '#e7dfd0';
                const baseFill = isWhite ? '#e2d9c4' : '#282828';
                const svg =
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">' +
                    '<g stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">' +
                    // base step 2 (widest)
                    '<rect x="8" y="41" width="29" height="3.5" rx="1.5"' +
                    ' fill="' + baseFill + '" stroke="' + stroke + '"/>' +
                    // base step 1
                    '<rect x="11" y="38" width="23" height="3" rx="1"' +
                    ' fill="' + baseFill + '" stroke="' + stroke + '"/>' +
                    // lower skirt: arch from base up to bottom of oval body
                    '<path d="M11,38 C11,35 14.5,33.5 22.5,33.5 C30.5,33.5 34,35 34,38 Z"' +
                    ' fill="' + fill + '" stroke="' + stroke + '"/>' +
                    // main body: tall symmetric oval (the mitre)
                    '<path d="M22.5,9' +
                    ' C17,9 13,15 13,22.5' +
                    ' C13,29 17,33.5 22.5,33.5' +
                    ' C28,33.5 32,29 32,22.5' +
                    ' C32,15 28,9 22.5,9 Z"' +
                    ' fill="' + fill + '" stroke="' + stroke + '"/>' +
                    // characteristic horizontal slash
                    '<path d="M14.5,27 L30.5,27"' +
                    ' fill="none" stroke="' + detail + '" stroke-width="1.2"/>' +
                    // ball on tip
                    '<circle cx="22.5" cy="7" r="2.5"' +
                    ' fill="' + fill + '" stroke="' + stroke + '"/>' +
                    '</g>' +
                    '</svg>';
                return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
            }

            // Knight: use actual traced Staunton silhouette paths (Cburnett/Wikipedia chess set)
            if (pieceKind === 'knight') {
                const detail = isWhite ? '#202020' : '#e7dfd0';
                const baseFill = isWhite ? '#e2d9c4' : '#282828';
                const svg =
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">' +
                    '<g transform="translate(0,0.3)" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4">' +
                    '<path d="M22,10 C32.5,11 38.5,18 38,39 L15,39 C15,30 25,32.5 23,18"' +
                    ' fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>' +
                    '<path d="M24,18 C24.38,20.91 18.45,25.37 16,27 C13,29 13.18,31.34 11,31' +
                    ' C9.958,30.06 12.41,27.96 11,28 C10,28 11.19,29.23 10,30 C9,30 5.997,31 6,26' +
                    ' C6,24 12,14 12,14 C12,14 13.89,12.1 14,10.5 C13.27,9.506 13.5,8.5 13.5,7.5' +
                    ' C14.5,6.5 16.5,10 16.5,10 L18.5,10 C18.5,10 19.28,8.008 21,7 C22,7 22,10 22,10"' +
                    ' fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>' +
                    '<path d="M9.5,25.5 A0.5,0.5 0 1 1 8.5,25.5 A0.5,0.5 0 1 1 9.5,25.5 z"' +
                    ' fill="' + detail + '" stroke="none"/>' +
                    '<path d="M15,15.5 A0.5,1.5 0 1 1 14,15.5 A0.5,1.5 0 1 1 15,15.5 z"' +
                    ' fill="' + detail + '" stroke="none" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"/>' +
                    '<path d="M24.55,10.4 L24.1,11.85 L24.6,12 C27.75,13 30.25,14.49 32.5,18.75' +
                    ' C34.75,23.01 35.75,29.06 35.25,39 L35.2,39.5 L37.45,39.5 L37.5,39' +
                    ' C38,28.94 36.62,22.15 34.25,17.62 C31.88,13.09 28.46,11.02 25.06,10.5 Z"' +
                    ' fill="' + detail + '" stroke="none"/>' +
                    '</g>' +
                    '<polygon points="12,39.3 12,42.3 35.5,42.3 35.5,39.3"' +
                    ' fill="' + baseFill + '" stroke="' + stroke + '" stroke-width="1.5"/>' +
                    '<polygon points="10,42.3 10,44.8 13,44.8 14,44.3 36,44.3 37,44.8 40,44.8 40,42.3"' +
                    ' fill="' + baseFill + '" stroke="' + stroke + '" stroke-width="1.5"/>' +
                    '</svg>';
                return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
            }

            const shapesByPiece = {
                pawn: [
                    '<circle cx="32" cy="17" r="7" />',
                    '<path d="M24 31c0-5 3-9 8-9s8 4 8 9c0 2-1 4-2 6l4 6H22l4-6c-1-2-2-4-2-6Z" />',
                    '<rect x="22" y="43" width="20" height="5" rx="2" />',
                    '<rect x="18" y="49" width="28" height="5" rx="2" />'
                ],
                rook: [
                    '<rect x="18" y="12" width="7" height="8" rx="1" />',
                    '<rect x="28.5" y="12" width="7" height="8" rx="1" />',
                    '<rect x="39" y="12" width="7" height="8" rx="1" />',
                    '<rect x="18" y="20" width="28" height="22" rx="2" />',
                    '<rect x="21" y="24" width="22" height="14" rx="1" fill="none" />',
                    '<rect x="16" y="43" width="32" height="5" rx="2" />',
                    '<rect x="12" y="49" width="40" height="5" rx="2" />'
                ],
                queen: [
                    '<circle cx="18" cy="16" r="3.5" />',
                    '<circle cx="28" cy="12" r="3.5" />',
                    '<circle cx="36" cy="12" r="3.5" />',
                    '<circle cx="46" cy="16" r="3.5" />',
                    '<path d="M18 19l6 11 8-15 8 15 6-11 3 23H15l3-23Z" />',
                    '<rect x="20" y="42" width="24" height="5" rx="2" />',
                    '<rect x="15" y="49" width="34" height="5" rx="2" />'
                ],
                king: [
                    '<path d="M32 9v12" fill="none" />',
                    '<path d="M27 14h10" fill="none" />',
                    '<path d="M24 22h16l-2 7 5 13H21l5-13-2-7Z" />',
                    '<rect x="21" y="42" width="22" height="5" rx="2" />',
                    '<rect x="16" y="49" width="32" height="5" rx="2" />'
                ],
            };

            const accentShape = pieceKind === 'queen' || pieceKind === 'king'
                ? '<path d="M21 42h22" fill="none" stroke="' + accent + '" stroke-width="1.5" />'
                : '<path d="M22 43h20" fill="none" stroke="' + accent + '" stroke-width="1.5" />';
            const kingCrossShape = pieceKind === 'king'
                ? '<g fill="none" stroke="' + (isWhite ? stroke : '#111111') + '" stroke-width="2.5" stroke-linecap="round"><path d="M32 9v12" /><path d="M27 14h10" /></g>'
                : '';

            const svg = [
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
                '<g fill="' + fill + '" stroke="' + stroke + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
                ...shapesByPiece[pieceKind],
                '</g>',
                kingCrossShape,
                accentShape,
                '</svg>'
            ].join('');

            return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
        }

        for (let piece = W_PAWN; piece <= B_KING; piece++) {
            const isWhite = piece <= W_KING;
            sprites[piece] = createClassicSprite(pieceKinds[piece], isWhite);
        }
        return sprites;
    }

    const MINECRAFT_SPRITES = generateSprites();
    const CLASSIC_SPRITES = generateClassicSprites();
    const SETTINGS_STORAGE_KEY = 'scary-chess-settings';

    let currentTheme = 'scary-minecraft';
    let activeSprites = MINECRAFT_SPRITES;
    let activeLabels = MINECRAFT_LABELS;

    const THEME_BRANDING = {
        'classic-chess': {
            pageTitle: 'Classic Chess',
            heading: 'Classic Chess',
            favicon: 'favicon-classic.svg',
        },
        'scary-minecraft': {
            pageTitle: 'Scary Chess',
            heading: 'Scary Chess',
            favicon: 'favicon.svg',
        },
    };

    function updateThemeBranding(theme) {
        const branding = THEME_BRANDING[theme] || THEME_BRANDING['scary-minecraft'];
        document.title = branding.pageTitle;
        document.body.dataset.theme = theme;

        const heading = document.querySelector('.title-row h1');
        if (heading) {
            heading.textContent = branding.heading;
        }

        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = branding.favicon;
        }
    }

    function applyTheme(theme) {
        currentTheme = theme;
        if (theme === 'classic-chess') {
            activeSprites = CLASSIC_SPRITES;
            activeLabels = CLASSIC_LABELS;
        } else {
            activeSprites = MINECRAFT_SPRITES;
            activeLabels = MINECRAFT_LABELS;
        }
        updateThemeBranding(theme);
        writeStoredSettings();
        if (board.length === 64) {
            render();
            updateStatus();
        }
    }

    const WHITE = 'white';
    const BLACK = 'black';

    function pieceColor(p) {
        if (p >= W_PAWN && p <= W_KING) return WHITE;
        if (p >= B_PAWN && p <= B_KING) return BLACK;
        return null;
    }

    function pieceType(p) {
        if (p === EMPTY) return null;
        return p <= W_KING ? p : p - 6;
    }

    // ---- Game State ----
    let board = [];         // 64 elements, index = row*8+col, row 0 = rank 8 (top)
    let turn = WHITE;
    let castlingRights = { wK: true, wQ: true, bK: true, bQ: true };
    let enPassantTarget = null;  // {row, col} or null
    let halfMoveClock = 0;
    let moveHistory = [];        // for undo
    let selectedSquare = null;
    let legalMovesForSelected = [];
    let lastMove = null;         // {from, to}
    let capturedByWhite = [];
    let capturedByBlack = [];
    let gameOver = false;
    let isRemoteAction = false;
    let reloadProtectionEnabled = true;

    function readStoredSettings() {
        try {
            const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch {
            return {};
        }
    }

    function writeStoredSettings() {
        try {
            window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
                theme: currentTheme,
                reloadProtectionEnabled,
            }));
        } catch {
            // Ignore storage failures so the game still works in restricted browsers.
        }
    }

    function syncSettingsControls() {
        const reloadToggle = document.getElementById('reload-protection-toggle');
        if (reloadToggle) {
            reloadToggle.checked = reloadProtectionEnabled;
        }

        document.querySelectorAll('input[name="theme"]').forEach((input) => {
            input.checked = input.value === currentTheme;
        });
    }

    function restoreSettings() {
        const settings = readStoredSettings();

        if (settings.theme === 'classic-chess' || settings.theme === 'scary-minecraft') {
            currentTheme = settings.theme;
        }

        if (typeof settings.reloadProtectionEnabled === 'boolean') {
            reloadProtectionEnabled = settings.reloadProtectionEnabled;
        }

        syncSettingsControls();
    }

    // ---- Board Setup ----
    const INITIAL_BOARD = [
        B_ROOK, B_KNIGHT, B_BISHOP, B_QUEEN, B_KING, B_BISHOP, B_KNIGHT, B_ROOK,
        B_PAWN, B_PAWN, B_PAWN, B_PAWN, B_PAWN, B_PAWN, B_PAWN, B_PAWN,
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
        W_PAWN, W_PAWN, W_PAWN, W_PAWN, W_PAWN, W_PAWN, W_PAWN, W_PAWN,
        W_ROOK, W_KNIGHT, W_BISHOP, W_QUEEN, W_KING, W_BISHOP, W_KNIGHT, W_ROOK,
    ];

    function idx(r, c) { return r * 8 + c; }
    function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

    function initGame() {
        board = [...INITIAL_BOARD];
        turn = WHITE;
        castlingRights = { wK: true, wQ: true, bK: true, bQ: true };
        enPassantTarget = null;
        halfMoveClock = 0;
        moveHistory = [];
        selectedSquare = null;
        legalMovesForSelected = [];
        lastMove = null;
        capturedByWhite = [];
        capturedByBlack = [];
        gameOver = false;
        render();
        updateStatus();
        if (!isRemoteAction) {
            sendToPeer({ type: 'chess-newgame' });
        }
    }

    // ---- Move Generation ----

    function pseudoLegalMoves(color, brd, epTarget, castling) {
        const moves = [];
        const dir = color === WHITE ? -1 : 1;
        const startRow = color === WHITE ? 6 : 1;
        const promoRow = color === WHITE ? 0 : 7;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = brd[idx(r, c)];
                if (pieceColor(p) !== color) continue;
                const type = pieceType(p);

                if (type === 1) { // Pawn
                    // Forward
                    const nr = r + dir;
                    if (inBounds(nr, c) && brd[idx(nr, c)] === EMPTY) {
                        if (nr === promoRow) {
                            [2, 3, 4, 5].forEach(pt => moves.push({ from: { r, c }, to: { r: nr, c }, promo: pt }));
                        } else {
                            moves.push({ from: { r, c }, to: { r: nr, c } });
                        }
                        // Double push
                        if (r === startRow) {
                            const nr2 = r + dir * 2;
                            if (brd[idx(nr2, c)] === EMPTY) {
                                moves.push({ from: { r, c }, to: { r: nr2, c }, doublePush: true });
                            }
                        }
                    }
                    // Captures
                    for (const dc of [-1, 1]) {
                        const nc = c + dc;
                        if (!inBounds(nr, nc)) continue;
                        const target = brd[idx(nr, nc)];
                        if (target !== EMPTY && pieceColor(target) !== color) {
                            if (nr === promoRow) {
                                [2, 3, 4, 5].forEach(pt => moves.push({ from: { r, c }, to: { r: nr, c: nc }, promo: pt }));
                            } else {
                                moves.push({ from: { r, c }, to: { r: nr, c: nc } });
                            }
                        }
                        // En passant
                        if (epTarget && epTarget.row === nr && epTarget.col === nc) {
                            moves.push({ from: { r, c }, to: { r: nr, c: nc }, enPassant: true });
                        }
                    }
                } else if (type === 2) { // Knight
                    for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
                        const nr = r + dr, nc = c + dc;
                        if (inBounds(nr, nc) && pieceColor(brd[idx(nr, nc)]) !== color) {
                            moves.push({ from: { r, c }, to: { r: nr, c: nc } });
                        }
                    }
                } else if (type === 3) { // Bishop
                    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                        slideMoves(r, c, dr, dc, color, brd, moves);
                    }
                } else if (type === 4) { // Rook
                    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                        slideMoves(r, c, dr, dc, color, brd, moves);
                    }
                } else if (type === 5) { // Queen
                    for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
                        slideMoves(r, c, dr, dc, color, brd, moves);
                    }
                } else if (type === 6) { // King
                    for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
                        const nr = r + dr, nc = c + dc;
                        if (inBounds(nr, nc) && pieceColor(brd[idx(nr, nc)]) !== color) {
                            moves.push({ from: { r, c }, to: { r: nr, c: nc } });
                        }
                    }
                    // Castling
                    if (color === WHITE) {
                        if (castling.wK) addCastleMove(r, c, r, 6, r, 7, r, 5, color, brd, moves);
                        if (castling.wQ) addCastleMove(r, c, r, 2, r, 0, r, 3, color, brd, moves, true);
                    } else {
                        if (castling.bK) addCastleMove(r, c, r, 6, r, 7, r, 5, color, brd, moves);
                        if (castling.bQ) addCastleMove(r, c, r, 2, r, 0, r, 3, color, brd, moves, true);
                    }
                }
            }
        }
        return moves;
    }

    function slideMoves(r, c, dr, dc, color, brd, moves) {
        let nr = r + dr, nc = c + dc;
        while (inBounds(nr, nc)) {
            const target = brd[idx(nr, nc)];
            if (target === EMPTY) {
                moves.push({ from: { r, c }, to: { r: nr, c: nc } });
            } else {
                if (pieceColor(target) !== color) {
                    moves.push({ from: { r, c }, to: { r: nr, c: nc } });
                }
                break;
            }
            nr += dr;
            nc += dc;
        }
    }

    function addCastleMove(kr, kc, kr2, kc2, rookR, rookC, rookDestR, rookDestC, color, brd, moves, isQueenside) {
        // Check that squares between king and rook are empty
        const minC = Math.min(kc, rookC);
        const maxC = Math.max(kc, rookC);
        for (let cc = minC + 1; cc < maxC; cc++) {
            if (brd[idx(kr, cc)] !== EMPTY) return;
        }
        // Check king is not in check, does not pass through check, does not end in check
        const opp = color === WHITE ? BLACK : WHITE;
        if (isSquareAttacked(kr, kc, opp, brd)) return;
        const step = kc2 > kc ? 1 : -1;
        for (let cc = kc + step; cc !== kc2 + step; cc += step) {
            if (isSquareAttacked(kr, cc, opp, brd)) return;
        }
        moves.push({ from: { r: kr, c: kc }, to: { r: kr2, c: kc2 }, castle: true, rookFrom: { r: rookR, c: rookC }, rookTo: { r: rookDestR, c: rookDestC } });
    }

    function isSquareAttacked(r, c, byColor, brd) {
        // Check attacks from knights
        for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
            const nr = r + dr, nc = c + dc;
            if (inBounds(nr, nc)) {
                const p = brd[idx(nr, nc)];
                if (pieceColor(p) === byColor && pieceType(p) === 2) return true;
            }
        }
        // Check attacks from king
        for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
            const nr = r + dr, nc = c + dc;
            if (inBounds(nr, nc)) {
                const p = brd[idx(nr, nc)];
                if (pieceColor(p) === byColor && pieceType(p) === 6) return true;
            }
        }
        // Check sliding attacks (rook/queen on ranks/files, bishop/queen on diagonals)
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            let nr = r + dr, nc = c + dc;
            while (inBounds(nr, nc)) {
                const p = brd[idx(nr, nc)];
                if (p !== EMPTY) {
                    if (pieceColor(p) === byColor && (pieceType(p) === 4 || pieceType(p) === 5)) return true;
                    break;
                }
                nr += dr; nc += dc;
            }
        }
        for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
            let nr = r + dr, nc = c + dc;
            while (inBounds(nr, nc)) {
                const p = brd[idx(nr, nc)];
                if (p !== EMPTY) {
                    if (pieceColor(p) === byColor && (pieceType(p) === 3 || pieceType(p) === 5)) return true;
                    break;
                }
                nr += dr; nc += dc;
            }
        }
        // Check pawn attacks
        const pawnDir = byColor === WHITE ? 1 : -1; // pawns attack toward opposite direction of movement
        for (const dc of [-1, 1]) {
            const nr = r + pawnDir, nc = c + dc;
            if (inBounds(nr, nc)) {
                const p = brd[idx(nr, nc)];
                if (pieceColor(p) === byColor && pieceType(p) === 1) return true;
            }
        }
        return false;
    }

    function findKing(color, brd) {
        const king = color === WHITE ? W_KING : B_KING;
        for (let i = 0; i < 64; i++) {
            if (brd[i] === king) return { r: Math.floor(i / 8), c: i % 8 };
        }
        return null;
    }

    function isInCheck(color, brd) {
        const king = findKing(color, brd);
        if (!king) return false;
        const opp = color === WHITE ? BLACK : WHITE;
        return isSquareAttacked(king.r, king.c, opp, brd);
    }

    function applyMoveOnBoard(move, brd) {
        const newBrd = [...brd];
        const { from, to } = move;
        const piece = newBrd[idx(from.r, from.c)];
        const captured = newBrd[idx(to.r, to.c)];

        newBrd[idx(to.r, to.c)] = piece;
        newBrd[idx(from.r, from.c)] = EMPTY;

        if (move.enPassant) {
            // Remove the captured pawn
            const capturedRow = from.r;
            newBrd[idx(capturedRow, to.c)] = EMPTY;
        }

        if (move.castle) {
            newBrd[idx(move.rookTo.r, move.rookTo.c)] = newBrd[idx(move.rookFrom.r, move.rookFrom.c)];
            newBrd[idx(move.rookFrom.r, move.rookFrom.c)] = EMPTY;
        }

        if (move.promo) {
            const color = pieceColor(piece);
            newBrd[idx(to.r, to.c)] = color === WHITE ? move.promo : move.promo + 6;
        }

        return { newBrd, captured };
    }

    function legalMoves(color) {
        const pseudo = pseudoLegalMoves(color, board, enPassantTarget, castlingRights);
        const legal = [];
        for (const move of pseudo) {
            const { newBrd } = applyMoveOnBoard(move, board);
            if (!isInCheck(color, newBrd)) {
                legal.push(move);
            }
        }
        return legal;
    }

    function getLegalMovesFrom(r, c) {
        return legalMoves(turn).filter(m => m.from.r === r && m.from.c === c);
    }

    // ---- Execute Move ----

    let pendingPromotion = null;

    function executeMove(move) {
        // Save state for undo
        const snapshot = {
            board: [...board],
            turn,
            castlingRights: { ...castlingRights },
            enPassantTarget: enPassantTarget ? { ...enPassantTarget } : null,
            halfMoveClock,
            lastMove: lastMove ? { ...lastMove } : null,
            capturedByWhite: [...capturedByWhite],
            capturedByBlack: [...capturedByBlack],
        };
        moveHistory.push(snapshot);

        const from = move.from;
        const to = move.to;
        const piece = board[idx(from.r, from.c)];
        let captured = board[idx(to.r, to.c)];

        // Handle en passant capture
        if (move.enPassant) {
            captured = board[idx(from.r, to.c)];
            board[idx(from.r, to.c)] = EMPTY;
        }

        // Move piece
        board[idx(to.r, to.c)] = piece;
        board[idx(from.r, from.c)] = EMPTY;

        // Castling - move rook
        if (move.castle) {
            board[idx(move.rookTo.r, move.rookTo.c)] = board[idx(move.rookFrom.r, move.rookFrom.c)];
            board[idx(move.rookFrom.r, move.rookFrom.c)] = EMPTY;
        }

        // Promotion
        if (move.promo) {
            const color = pieceColor(piece);
            board[idx(to.r, to.c)] = color === WHITE ? move.promo : move.promo + 6;
        }

        // Record capture
        if (captured !== EMPTY) {
            if (turn === WHITE) capturedByWhite.push(captured);
            else capturedByBlack.push(captured);
        }

        // Update en passant target
        if (move.doublePush) {
            enPassantTarget = { row: (from.r + to.r) / 2, col: from.c };
        } else {
            enPassantTarget = null;
        }

        // Update castling rights
        if (pieceType(piece) === 6) { // King moved
            if (turn === WHITE) { castlingRights.wK = false; castlingRights.wQ = false; }
            else { castlingRights.bK = false; castlingRights.bQ = false; }
        }
        if (pieceType(piece) === 4) { // Rook moved
            if (from.r === 7 && from.c === 0) castlingRights.wQ = false;
            if (from.r === 7 && from.c === 7) castlingRights.wK = false;
            if (from.r === 0 && from.c === 0) castlingRights.bQ = false;
            if (from.r === 0 && from.c === 7) castlingRights.bK = false;
        }
        // If a rook is captured
        if (to.r === 7 && to.c === 0) castlingRights.wQ = false;
        if (to.r === 7 && to.c === 7) castlingRights.wK = false;
        if (to.r === 0 && to.c === 0) castlingRights.bQ = false;
        if (to.r === 0 && to.c === 7) castlingRights.bK = false;

        // Update half-move clock
        if (pieceType(piece) === 1 || captured !== EMPTY) halfMoveClock = 0;
        else halfMoveClock++;

        lastMove = { from: { ...from }, to: { ...to } };
        turn = turn === WHITE ? BLACK : WHITE;

        selectedSquare = null;
        legalMovesForSelected = [];

        render();
        updateStatus();
        if (!isRemoteAction) {
            sendToPeer({ type: 'chess-move', move: move });
        }
    }

    function undoMove() {
        if (moveHistory.length === 0 || gameOver) return;
        const snapshot = moveHistory.pop();
        board = snapshot.board;
        turn = snapshot.turn;
        castlingRights = snapshot.castlingRights;
        enPassantTarget = snapshot.enPassantTarget;
        halfMoveClock = snapshot.halfMoveClock;
        lastMove = snapshot.lastMove;
        capturedByWhite = snapshot.capturedByWhite;
        capturedByBlack = snapshot.capturedByBlack;
        selectedSquare = null;
        legalMovesForSelected = [];
        gameOver = false;
        render();
        updateStatus();
        if (!isRemoteAction) {
            sendToPeer({ type: 'chess-undo' });
        }
    }

    // ---- Status ----

    function renderTurnIndicator(turnEl) {
        if (gameOver) {
            turnEl.textContent = '';
            return;
        }

        const side = turn === WHITE ? 'White' : 'Black';
        const pawnPiece = turn === WHITE ? W_PAWN : B_PAWN;

        turnEl.innerHTML = '';
        const icon = document.createElement('img');
        icon.src = activeSprites[pawnPiece];
        icon.alt = `${side} pawn`;
        icon.className = 'turn-pawn-icon';

        const text = document.createElement('span');
        text.textContent = `${side}'s Turn`;

        turnEl.appendChild(icon);
        turnEl.appendChild(text);
    }

    function updateStatus() {
        const turnEl = document.getElementById('turn-indicator');
        const statusEl = document.getElementById('status');

        if (gameOver) return;

        const moves = legalMoves(turn);
        const inCheck = isInCheck(turn, board);

        if (moves.length === 0) {
            gameOver = true;
            if (inCheck) {
                const winner = turn === WHITE ? 'Black' : 'White';
                statusEl.textContent = `Checkmate! ${winner} wins!`;
            } else {
                statusEl.textContent = 'Stalemate! Draw.';
            }
        } else if (inCheck) {
            statusEl.textContent = 'Check!';
        } else if (halfMoveClock >= 100) {
            gameOver = true;
            statusEl.textContent = 'Draw by 50-move rule.';
        } else if (isInsufficientMaterial()) {
            gameOver = true;
            statusEl.textContent = 'Draw by insufficient material.';
        } else {
            statusEl.textContent = '';
        }

        renderTurnIndicator(turnEl);
    }

    function isInsufficientMaterial() {
        const pieces = [];
        for (let i = 0; i < 64; i++) {
            if (board[i] !== EMPTY) pieces.push(board[i]);
        }
        if (pieces.length === 2) return true; // K vs K
        if (pieces.length === 3) {
            for (const p of pieces) {
                const t = pieceType(p);
                if (t === 2 || t === 3) return true; // K+B vs K or K+N vs K
            }
        }
        if (pieces.length === 4) {
            const bishops = pieces.filter(p => pieceType(p) === 3);
            if (bishops.length === 2) {
                // K+B vs K+B same color bishops
                const positions = [];
                for (let i = 0; i < 64; i++) {
                    if (pieceType(board[i]) === 3) positions.push(i);
                }
                if (positions.length === 2) {
                    const [a, b] = positions;
                    const colorA = (Math.floor(a / 8) + a % 8) % 2;
                    const colorB = (Math.floor(b / 8) + b % 8) % 2;
                    return colorA === colorB;
                }
            }
        }
        return false;
    }

    // ---- Rendering ----

    function render() {
        const boardEl = document.getElementById('board');
        boardEl.innerHTML = '';

        const inCheck = isInCheck(turn, board);
        const kingPos = inCheck ? findKing(turn, board) : null;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const sq = document.createElement('div');
                sq.className = 'square ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
                sq.dataset.row = r;
                sq.dataset.col = c;

                const p = board[idx(r, c)];
                if (p !== EMPTY) {
                    const img = document.createElement('img');
                    img.src = activeSprites[p];
                    img.alt = activeLabels[p];
                    img.title = activeLabels[p];
                    img.className = 'piece-img';
                    img.draggable = false;
                    sq.appendChild(img);
                }

                // Highlight last move
                if (lastMove) {
                    if ((r === lastMove.from.r && c === lastMove.from.c) ||
                        (r === lastMove.to.r && c === lastMove.to.c)) {
                        sq.classList.add('last-move');
                    }
                }

                // Highlight selected square
                if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                    sq.classList.add('selected');
                }

                // Show legal move indicators
                if (legalMovesForSelected.some(m => m.to.r === r && m.to.c === c)) {
                    if (p !== EMPTY || legalMovesForSelected.some(m => m.to.r === r && m.to.c === c && m.enPassant)) {
                        sq.classList.add('legal-capture');
                    } else {
                        sq.classList.add('legal-move');
                    }
                }

                // Highlight king in check
                if (kingPos && kingPos.r === r && kingPos.c === c) {
                    sq.classList.add('check');
                }

                sq.addEventListener('click', () => onSquareClick(r, c));
                boardEl.appendChild(sq);
            }
        }

        renderCaptured();
    }

    function renderCaptured() {
        const pieceValue = p => [0, 1, 3, 3, 5, 9, 0][pieceType(p)] || 0;
        const sort = arr => [...arr].sort((a, b) => pieceValue(b) - pieceValue(a));

        const renderList = (el, pieces) => {
            el.innerHTML = '';
            sort(pieces).forEach(p => {
                const img = document.createElement('img');
                img.src = activeSprites[p];
                img.alt = activeLabels[p];
                img.className = 'captured-img';
                el.appendChild(img);
            });
        };
        renderList(document.getElementById('captured-white'), capturedByWhite);
        renderList(document.getElementById('captured-black'), capturedByBlack);
    }

    // ---- Interaction ----

    function onSquareClick(r, c) {
        if (gameOver) return;

        const piece = board[idx(r, c)];

        // If clicking a legal move destination
        if (selectedSquare && legalMovesForSelected.some(m => m.to.r === r && m.to.c === c)) {
            const matchingMoves = legalMovesForSelected.filter(m => m.to.r === r && m.to.c === c);

            // Check if this is a promotion move (multiple moves for same destination)
            if (matchingMoves.length > 1 && matchingMoves[0].promo) {
                showPromotionModal(matchingMoves);
                return;
            }

            executeMove(matchingMoves[0]);
            return;
        }

        // Select a piece of current turn's color
        if (piece !== EMPTY && pieceColor(piece) === turn) {
            selectedSquare = { r, c };
            legalMovesForSelected = getLegalMovesFrom(r, c);
            render();
            return;
        }

        // Deselect
        selectedSquare = null;
        legalMovesForSelected = [];
        render();
    }

    function showPromotionModal(moves) {
        const modal = document.getElementById('promotion-modal');
        const choices = document.getElementById('promotion-choices');
        choices.innerHTML = '';

        const color = turn;
        const promoTypes = [5, 4, 3, 2]; // Queen, Rook, Bishop, Knight

        promoTypes.forEach(pt => {
            const piece = color === WHITE ? pt : pt + 6;
            const span = document.createElement('span');
            const img = document.createElement('img');
            img.src = activeSprites[piece];
            img.alt = activeLabels[piece];
            img.className = 'promo-img';
            span.appendChild(img);
            span.addEventListener('click', () => {
                modal.classList.add('hidden');
                const move = moves.find(m => m.promo === pt);
                if (move) executeMove(move);
            });
            choices.appendChild(span);
        });

        modal.classList.remove('hidden');
    }

    // ---- PeerJS Multiplayer ----

    let peer = null;
    let conn = null;

    function sendToPeer(data) {
        if (conn && conn.open) {
            conn.send(data);
        }
    }

    function sendState() {
        sendToPeer({
            type: 'chess-state',
            board: board,
            turn: turn,
            castlingRights: castlingRights,
            enPassantTarget: enPassantTarget,
            halfMoveClock: halfMoveClock,
            lastMove: lastMove,
            capturedByWhite: capturedByWhite,
            capturedByBlack: capturedByBlack,
            gameOver: gameOver,
            moveHistory: moveHistory,
        });
    }

    function applyRemoteState(msg) {
        board = msg.board;
        turn = msg.turn;
        castlingRights = msg.castlingRights;
        enPassantTarget = msg.enPassantTarget;
        halfMoveClock = msg.halfMoveClock;
        lastMove = msg.lastMove;
        capturedByWhite = msg.capturedByWhite;
        capturedByBlack = msg.capturedByBlack;
        gameOver = msg.gameOver;
        moveHistory = msg.moveHistory;
        selectedSquare = null;
        legalMovesForSelected = [];
        render();
        updateStatus();
    }

    function handlePeerData(msg) {
        isRemoteAction = true;
        switch (msg.type) {
            case 'chess-move':     executeMove(msg.move); break;
            case 'chess-undo':     undoMove();            break;
            case 'chess-newgame':  initGame();            break;
            case 'chess-state':    applyRemoteState(msg); break;
        }
        isRemoteAction = false;
    }

    function setupConn(c) {
        c.on('open', function () {
            setConnectionStatus('connected');
        });
        c.on('data', handlePeerData);
        c.on('close', function () {
            conn = null;
            setConnectionStatus('disconnected');
        });
        c.on('error', function () {
            setConnectionStatus('error');
        });
    }

    function hostGame() {
        if (peer) { peer.destroy(); peer = null; }
        peer = new Peer();
        peer.on('open', function (id) {
            const base = window.location.href.split('?')[0];
            const shareUrl = base + '?join=' + encodeURIComponent(id);
            document.getElementById('share-link-display').textContent = shareUrl;
            setShareFallbackTargets(shareUrl);
            document.getElementById('share-fallback-actions').classList.add('hidden');
            document.getElementById('share-modal').classList.remove('hidden');
            setConnectionStatus('hosting');
        });
        peer.on('connection', function (c) {
            if (conn) conn.close();
            conn = c;
            setupConn(c);
            document.getElementById('share-modal').classList.add('hidden');
            // Send current board state to the joiner
            c.on('open', function () { sendState(); });
        });
        peer.on('error', function (err) {
            setConnectionStatus('error');
            alert('PeerJS error: ' + err.type);
        });
    }

    function joinGame(hostId) {
        if (peer) { peer.destroy(); peer = null; }
        setConnectionStatus('connecting');
        peer = new Peer();
        peer.on('open', function () {
            conn = peer.connect(hostId);
            setupConn(conn);
        });
        peer.on('error', function () {
            setConnectionStatus('error');
            alert('Could not connect to host. Make sure the link is correct and the host is still online.');
        });
    }

    function setShareFallbackTargets(url) {
        const safeUrl = String(url || '').trim();
        if (!safeUrl) return;

        const message = `Play Scary Chess with me: ${safeUrl}`;
        const emailLink = document.getElementById('share-email-link');
        const whatsappLink = document.getElementById('share-whatsapp-link');

        if (emailLink) {
            emailLink.href = `mailto:?subject=${encodeURIComponent('Play Scary Chess with me')}&body=${encodeURIComponent(message)}`;
        }
        if (whatsappLink) {
            whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
        }
    }

    function setConnectionStatus(status) {
        const el = document.getElementById('connection-status');
        const labels = {
            hosting:      'Hosting \u2014 waiting for opponent\u2026',
            connecting:   'Connecting\u2026',
            connected:    'Opponent connected',
            disconnected: 'Opponent disconnected',
            error:        'Connection error',
        };
        const label = labels[status] || '';
        el.textContent = '';
        el.title = label;
        el.setAttribute('aria-label', label);
        el.className = 'connection-status connection-' + status;
        el.classList.remove('hidden');
    }

    function initMultiplayer() {
        const params = new URLSearchParams(window.location.search);
        const joinId = params.get('join');
        if (joinId) {
            joinGame(decodeURIComponent(joinId));
        }
    }

    function isReloadShortcut(e) {
        const key = (e.key || '').toLowerCase();
        return key === 'f5' || (key === 'r' && (e.ctrlKey || e.metaKey));
    }

    function openSettingsModal() {
        document.getElementById('settings-modal').classList.remove('hidden');
    }

    function closeSettingsModal() {
        document.getElementById('settings-modal').classList.add('hidden');
    }

    // ---- Event Listeners ----

    document.getElementById('new-game-btn').addEventListener('click', initGame);
    document.getElementById('undo-btn').addEventListener('click', undoMove);
    document.getElementById('play-together-btn').addEventListener('click', hostGame);
    document.getElementById('settings-btn').addEventListener('click', openSettingsModal);
    document.getElementById('close-settings-btn').addEventListener('click', closeSettingsModal);
    document.getElementById('settings-modal').addEventListener('click', function (e) {
        if (e.target.id === 'settings-modal') closeSettingsModal();
    });
    document.getElementById('reload-protection-toggle').addEventListener('change', function (e) {
        reloadProtectionEnabled = e.target.checked;
        writeStoredSettings();
    });
    document.querySelectorAll('input[name="theme"]').forEach((input) => {
        input.addEventListener('change', function (e) {
            if (e.target.checked) {
                applyTheme(e.target.value);
            }
        });
    });
    document.getElementById('copy-link-btn').addEventListener('click', function () {
        const text = document.getElementById('share-link-display').textContent;
        navigator.clipboard.writeText(text).then(function () {
            document.getElementById('copy-link-btn').textContent = 'Copied!';
            setTimeout(function () {
                document.getElementById('copy-link-btn').textContent = 'Copy Link';
            }, 1500);
        });
    });
    document.getElementById('share-link-btn').addEventListener('click', async function () {
        const url = document.getElementById('share-link-display').textContent.trim();
        if (!url) return;

        const message = `Play Scary Chess with me: ${url}`;
        setShareFallbackTargets(url);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Scary Chess',
                    text: message,
                    url,
                });
                return;
            } catch (err) {
                if (err && err.name === 'AbortError') return;
            }
        }

        document.getElementById('share-fallback-actions').classList.remove('hidden');
    });
    document.getElementById('close-share-modal-btn').addEventListener('click', function () {
        document.getElementById('share-modal').classList.add('hidden');
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (reloadProtectionEnabled && isReloadShortcut(e)) {
            e.preventDefault();
            return;
        }

        if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            undoMove();
        }
    });

    // Warn before accidental refresh/navigation that would reset the current game.
    window.addEventListener('beforeunload', (e) => {
        if (!reloadProtectionEnabled) return;
        e.preventDefault();
        e.returnValue = '';
    });

    // Start
    restoreSettings();
    applyTheme(currentTheme);
    initGame();
    initMultiplayer();
})();
