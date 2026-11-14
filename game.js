import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { clone as cloneSkinnedModel } from "three/addons/utils/SkeletonUtils.js";

const LEVEL_COUNT = 8;
const ROUND_INTERMISSION_DURATION = 25;
const ROUND_COUNTDOWN_DURATION = 5;
const SECRET_MESSAGE = "You made it through the dungeon! Put your own secret message here.";
const MONSTERS_PER_LEVEL = 10;
const MONSTERS_PER_LEVEL_INCREASE = 2;
const PLAYER_SPEED = 5.5;
const PLAYER_JUMP_SPEED = 7;
const PLAYER_GRAVITY = 20;
const PLAYER_MAX_HEALTH = 100;
const WITHER_MAX_HEALTH = 100;
const WITHER_HEALTH_PER_HEART = 20;
const WITHER_HOMING_HEALTH_THRESHOLD = 2 * WITHER_HEALTH_PER_HEART;
const WITHER_HOMING_CHASE_DURATION = 3;
const WITHER_HOMING_TURN_RATE = 2.5;
const WITHER_SHOOT_COOLDOWN = (2.5 / 1.4) * 1.1;
const WITHER_LEVEL_CREEPER_COUNT = 1;
const WITHER_CREEPER_SPAWN_DELAY = 1;
const WITHER_CREEPER_SPAWN_INTERVAL = 1;
const SHIELD_SHOP_TARGET_HEIGHT = 3.5 / 3;
const SHIELD_SHOP_FLOAT_HEIGHT = 1.5;
const SHIELD_SHOP_FLOAT_AMPLITUDE = 0.12;
const SHIELD_SHOP_FLOAT_SPEED = 1.5;
const SHIELD_SHOP_RISE_START = 0.45;
const SHIELD_SHOP_RISE_DURATION = 2.4;
const SHIELD_SHOP_CAMERA_MOVE_DURATION = 0.9;
const SHIELD_SHOP_CAMERA_RETURN_DURATION = 0.9;
const BOMB_HEALTH_PER_ICON = 25;
const BOMB_EXPLOSION_INITIAL_SPEED = 4;
const BOMB_EXPLOSION_ACCELERATION = 14;
const BOMB_EXPLOSION_INITIAL_RADIUS = 1;
const BOMB_EXPLOSION_EDGE_MARGIN = 2;
const BOMB_EXPLOSION_BOMB_HIDE_DELAY = 2.5;
const BOMB_EXPLOSION_ACCELERATION_DURATION = 8;
const BOMB_EXPLOSION_SLOW_MOTION_SCALE = 0.01;
const BOMB_EXPLOSION_MAX_TIME_SCALE = 0.1;
const BOMB_EXPLOSION_FLASH_RADIUS_RATIO = 0.2 / 4.95;
const BOMB_EXPLOSION_CAMERA_BACK_OFFSET = 4;
const BOMB_EXPLOSION_CAMERA_SIDE_OFFSET = 1.5;
const BOMB_EXPLOSION_CAMERA_HEIGHT = 2.8;
const BOMB_EXPLOSION_CAMERA_LOOK_DISTANCE = 5;
const BOMB_EXPLOSION_CAMERA_MOVE_DISTANCE = 24;
const BOMB_EXPLOSION_CAMERA_MOVE_DURATION = 4;
const BASE_MONSTER_SPEED = 1.5;
const MONSTER_LEVEL_SPEED_MULTIPLIER = 1.25;
const MAP_MAX_SIZE = 112;
const ACTOR_HEIGHT = 1.8;
const PLAYER_MODEL_SCALE = 0.8;
const INTRO_ORBIT_DURATION = 4.5;
const CAMERA_START_PITCH = Math.PI / 4;
const CAMERA_MAX_PITCH = Math.PI / 2 - 0.01;
const PLAYER_HEAD_HEIGHT = 1.28;
const PLAYER_HITBOX_FORWARD_OFFSET = 0.65;
const CAMERA_FLOOR_CLEARANCE = 0.05;
const CAMERA_START_DISTANCE = 8;
const CAMERA_MIN_DISTANCE = 4;
const CAMERA_MAX_DISTANCE = 16;
const TREE_MODEL_URL = new URL("./models/tree.glb", import.meta.url);
const MAP_MODEL_URL = new URL("./models/MAP.glb", import.meta.url);
const PLAYER_MODEL_URL = new URL("./models/pusheen.glb", import.meta.url);
const BOMB_MODEL_URL = new URL("./models/bomb.glb", import.meta.url);
const TURRET_MODEL_URL = new URL("./models/turret.glb", import.meta.url);
const TURRET_CROWN_MODEL_URL = new URL("./Crown.glb", import.meta.url);
const TURRET_SHOP_MODEL_URL = new URL("./models/turret shop.glb", import.meta.url);
const SHIELD_SHOP_MODEL_URL = new URL("./models/shield shop.glb", import.meta.url);
const MAGNET_MODEL_URL = new URL("./models/magnet.glb", import.meta.url);
const FOR_SALE_SIGN_MODEL_URL = new URL("./models/for sale sign.glb", import.meta.url);
const MYSTERY_BOX_MODEL_URL = new URL("./models/MBox.glb", import.meta.url);
const BULLET_MODEL_URL = new URL("./weapons/bullet.glb", import.meta.url);
const NYAN_CAT_MODEL_URL = new URL("./weapons/nyan cat.glb", import.meta.url);
const ROCKET_EXPLOSION_MODEL_URL = new URL("./explosionrgb.glb", import.meta.url);
const MONSTER_MODEL_URL = new URL("./enemies/half life zombie.glb", import.meta.url);
const CREEPER_MODEL_URL = new URL("./enemies/minecraft_creeper.glb", import.meta.url);
const EXPLOSION_MODEL_URL = new URL("./enemies/explosion.glb", import.meta.url);
const WITHER_MODEL_URL = new URL("./enemies/wither.glb", import.meta.url);
const WITHER_SKELETON_MODEL_URL = new URL("./enemies/wither skeleton.glb", import.meta.url);
const WITHER_EXPLOSION_MODEL_URL = new URL("./wither explosion.glb", import.meta.url);
const BOMB_SHIELD_MODEL_URL = new URL("./models/blue shield.glb", import.meta.url);
const AMMO_DROP_MODEL_URL = new URL("./mob drops/ammobox.glb", import.meta.url);
const MONEY_DROP_MODEL_URL = new URL("./mob drops/money.glb", import.meta.url);
const SMALLBOMB_DROP_MODEL_URL = new URL("./mob drops/smallbombglb", import.meta.url);
const RAINBOW_DROP_MODEL_URL = new URL("./mob drops/rainbow.glb", import.meta.url);
const CRAFTING_TABLE_MODEL_URL = new URL("./craft/crafting table.glb", import.meta.url);
const AMMO_SHOP_MODEL_URL = new URL("./shops/ammo shop.glb", import.meta.url);
const HEALING_SHOP_MODEL_URL = new URL("./shops/healing shop.glb", import.meta.url);
const FULL_HEART_IMAGE_URL = new URL("./HUD/full heart.png", import.meta.url);
const EMPTY_HEART_IMAGE_URL = new URL("./HUD/empty heart.png", import.meta.url);
const WITHER_FULL_HEART_IMAGE_URL = new URL("./HUD/wither heart full.png", import.meta.url);
const WITHER_EMPTY_HEART_IMAGE_URL = new URL("./HUD/wither heart empty.png", import.meta.url);
const FULL_SHIELD_IMAGE_URL = new URL("./HUD/full shield.png", import.meta.url);
const EMPTY_SHIELD_IMAGE_URL = new URL("./HUD/empty shield.png", import.meta.url);
const SOUND_EFFECTS = {
    pistol: { url: new URL("./sound effects/pistol.wav", import.meta.url), volume: 0.14 },
    shotgun: { url: new URL("./sound effects/shotgun.wav", import.meta.url), volume: 0.6 },
    tommyGun: { url: new URL("./sound effects/tommy gun.wav", import.meta.url), volume: 0.3 },
    sniper: { url: new URL("./sound effects/sniper shot.wav", import.meta.url), volume: 0.3 },
    toaster: { url: new URL("./sound effects/toaster.wav", import.meta.url), volume: 0.3 },
    toasterGunExplosion: { url: new URL("./sound effects/toaster gun explosion.wav", import.meta.url), volume: 0.35 },
    creeperExplosion: { url: new URL("./sound effects/creeper explosion.wav", import.meta.url), volume: 0.35 },
    nukeExplosion: { url: new URL("./nuke-explode.mp3", import.meta.url), volume: 0.5 },
    turretShoot: { url: new URL("./turret shooting.mp3", import.meta.url), volume: 1 },
    witherHurt1: { url: new URL("./wither sound affects/Wither_hurt1.mp3", import.meta.url), volume: 0.38 },
    witherHurt2: { url: new URL("./wither sound affects/Wither_hurt2.mp3", import.meta.url), volume: 0.38 },
    witherHurt3: { url: new URL("./wither sound affects/Wither_hurt3.mp3", import.meta.url), volume: 0.38 },
    witherHurt4: { url: new URL("./wither sound affects/Wither_hurt4.mp3", import.meta.url), volume: 0.38 },
    witherIdle1: { url: new URL("./wither sound affects/Wither_idle1.mp3", import.meta.url), volume: 0.22 },
    witherIdle2: { url: new URL("./wither sound affects/Wither_idle2.mp3", import.meta.url), volume: 0.22 },
    witherIdle3: { url: new URL("./wither sound affects/Wither_idle3.mp3", import.meta.url), volume: 0.22 },
    witherIdle4: { url: new URL("./wither sound affects/Wither_idle4.mp3", import.meta.url), volume: 0.22 },
    witherShoot: { url: new URL("./wither sound affects/Wither_shoot.mp3", import.meta.url), volume: 0.12 },
    witherDeath: { url: new URL("./wither sound affects/Wither_death.mp3", import.meta.url), volume: 0.45 }
};
const WEAPON_DEFINITIONS = [
    { id: "pistol", name: "Pistol", url: new URL("./weapons/pistol.glb", import.meta.url), rotation: [0, Math.PI / 2, 0], position: [0.75, 1.1, 1.05], damage: .5, range: 200, fireRate: 2.34, starter: true, magazineSize: 12, startingReserve: 36, ammoDropAmount: 12, reloadDuration: 1.2 },
    { id: "shotgun", name: "Shotgun", url: new URL("./weapons/shotgun.glb", import.meta.url), rotation: [0, -Math.PI / 2, 0], position: [0.75, 1.1, 1.05], damage: .7, range: 150, fireRate: 1, equippedSize: 1.45, pelletCount: 6, spread: 0.18, magazineSize: 6, startingReserve: 12, ammoDropAmount: 6, reloadDuration: 1.5 },
    { id: "sniper", name: "Sniper", url: new URL("./weapons/sniper.glb", import.meta.url), rotation: [0, 0, 0], position: [0.75, 1.1, 1.05], damage: 4, range: 300, fireRate: 0.6, equippedSize: 1.45, magazineSize: 5, startingReserve: 10, ammoDropAmount: 5, reloadDuration: 1.6 },
    { id: "shuriken", name: "Shuriken", url: new URL("./weapons/shuriken.glb", import.meta.url), rotation: [Math.PI / 2, 0, 0], position: [0.75, 1.1, 0.85], damage: 1, range: 100, fireRate: 2, magazineSize: 5, startingReserve: 10, ammoDropAmount: 5, reloadDuration: 1.1 },
    { id: "thommy-gun", name: "Thommy Gun", url: new URL("./weapons/thommy gun.glb", import.meta.url), rotation: [0, -Math.PI / 2, 0], position: [0.75, 1.1, 1.05], damage: .3, range: 120, fireRate: 8, autoFire: true, equippedSize: 1.1, magazineSize: 45, startingReserve: 60, ammoDropAmount: 30, reloadDuration: 1.7 },
    { id: "toaster", name: "Toaster", url: new URL("./weapons/toaster.glb", import.meta.url), rotation: [0, 0, 0], position: [0.75, 1.1, 1.05], damage: 6, range: 120, fireRate: 1.1, equippedSize: 1.2, projectileType: "rocket", magazineSize: 5, startingReserve: 8, ammoDropAmount: 4, reloadDuration: 1.5 }
];
const AMMO_DROP_WEAPONS = WEAPON_DEFINITIONS.filter((weapon) => weapon.id !== "toaster");
const MYSTERY_BOX_REWARDS = WEAPON_DEFINITIONS.filter(
    (weapon) => !weapon.starter && weapon.id !== "toaster"
);
const weaponAmmo = new Map();
const TREE_TARGET_HEIGHT = 9;
const TREE_SPACING = 10;
const TREE_SPAWN_CLEARANCE = 14;
const TREE_MAX_COUNT = 80;
const PLAYER_SPAWN_OFFSET_X = -12;
const MYSTERY_BOX_COST = 600;
const MYSTERY_BOX_INTERACTION_DISTANCE = 6;
const MYSTERY_BOX_TARGET_WIDTH = 3.5;
const HEALING_SHOP_COST = 500;
const HEALING_SHOP_HEALTH = 60;
const AMMO_SHOP_COST = 100;
const MAGNET_COST = 400;
const MAGNET_ATTRACTION_RADIUS = 18;
const MAGNET_ATTRACTION_SPEED = 8;
const TURRET_BASE_COST = 500;
const TURRET_COST_INCREMENT = 350;
const TURRET_MAX_COUNT = 4;
const TURRET_UPGRADE_COST = 1000;
const TURRET_CROWN_WIDTH_RATIO = 0.66;
const TURRET_CROWN_BASE_HEIGHT_RATIO = 0.78;
const TURRET_CROWN_FORWARD_OFFSET_RATIO = 0.055;
const TURRET_RANGE = 30;
const TURRET_BULLET_DAMAGE = 0.3;
const TURRET_FINAL_LEVEL_DAMAGE = 0.5;
const TURRET_FIRE_RATE = 9;
const TURRET_FIRE_INTERVAL = 1 / TURRET_FIRE_RATE;
const TURRET_UPGRADE_STAT_MULTIPLIER = 2;
const TURRET_SPREAD = 0.06;
const TURRET_PLACEMENT_RADIUS = 4.5;
const TURRET_COLLISION_RADIUS = 0.9;
const TURRET_INTERACTION_MARGIN = 1.5;
const TURRET_WEAPON = {
    id: "turret",
    name: "Turret",
    damage: TURRET_BULLET_DAMAGE,
    range: TURRET_RANGE
};
const AMMO_DROP_CHANCE = 0.15;
const RARE_COLLECTIBLE_DROP_CHANCE = 0.1;
const TOASTER_COLLECTIBLE_DROP_CHANCE = 0.15;
const MOB_DROP_SPREAD_RADIUS = 0.55;
const SHOP_INTERACTION_DISTANCE = 4.5;
const CRAFTING_STATION_INTERACTION_DISTANCE = 4.5;
const TOASTER_RECIPE_AMOUNT = 4;
const TOASTER_AMMO_RECIPE_AMOUNT = 1;
const TOASTER_AMMO_CRAFT_AMOUNT = 8;
const MYSTERY_BOX_ANIMATION_START_OFFSET = 4.4;
const CREEPER_EXPLOSION_DISTANCE = 2.5;
const CREEPER_EXPLOSION_DAMAGE = 25;
const CREEPER_BOMB_DAMAGE = 25;
const CREEPER_BOMB_SPAWN_CLEARANCE = 12;
const BOMB_MAX_HEALTH = 150;
const BOMB_SHIELD_MAX_HEALTH = 150;
const BOMB_SHIELD_HEALTH_PER_ICON = 25;
const BOMB_SHIELD_COST = 500;
const MONEY_DROP_VALUE = 125;
const STARTING_DABLOONS = 200;
const RAINBOW_PARTICLE_COUNT = 48;
const RAINBOW_PARTICLE_LIFETIME = 0.85;
const RAINBOW_PARTICLE_COLORS = [0xff3b30, 0xffa500, 0xffeb3b, 0x34c759, 0x32ade6, 0xaf52de];
const WITHER_PROJECTILE_GEOMETRY = new THREE.SphereGeometry(0.28, 12, 12);
const WITHER_PROJECTILE_MATERIAL = new THREE.MeshStandardMaterial({
    color: 0x9278ff,
    emissive: 0x6948ff,
    emissiveIntensity: 2.5,
    roughness: 0.3
});

const frame = document.querySelector(".game-frame");
const bombFlashOverlay = document.querySelector("#bomb-flash-overlay");
const fullscreenButton = document.querySelector("#fullscreen-button");
const gameScreen = document.querySelector("#game-screen");
const screenTitle = document.querySelector("#screen-title");
const screenDescription = document.querySelector("#screen-description");
const startButton = document.querySelector("#start-button");
const skipToLastLevelButton = document.querySelector("#skip-to-last-level-button");
const volumeControl = document.querySelector("#volume-control");
const volumeSlider = document.querySelector("#volume-slider");
const volumeValue = document.querySelector("#volume-value");
const weaponPreviewCanvas = document.querySelector("#weapon-preview-canvas");
const weaponPreviewName = document.querySelector("#weapon-preview-name");
const weaponQuickSelect = document.querySelector("#weapon-quick-select");
const controlsHint = document.querySelector(".controls-hint");
const gameMessage = document.querySelector("#game-message");
const mysteryBoxPrompt = document.querySelector("#mystery-box-prompt");
const gameError = document.querySelector("#game-error");
const levelDisplay = document.querySelector("#level-display");
const roundCountdownDisplay = document.querySelector("#round-countdown");
const healthDisplay = document.querySelector("#health-display");
const healthHeartDisplays = [...document.querySelectorAll("#health-display .health-heart")];
const bossDisplay = document.querySelector("#boss-display");
const witherHeartDisplays = [...document.querySelectorAll(".wither-heart")];
const bombDisplay = document.querySelector("#bomb-display");
const bombHealthCanvas = document.querySelector("#bomb-health-canvas");
const bombHealthFallback = document.querySelector("#bomb-health-fallback");
const bombShieldStatus = document.querySelector("#bomb-shield-status");
const bombShieldDisplays = [...document.querySelectorAll(".bomb-shield-icon")];
const dabloonDisplay = document.querySelector("#dabloon-display");
const dabloonValueDisplay = document.querySelector("#dabloon-value");
const ammoDisplay = document.querySelector("#ammo-display");
const ammoValueDisplay = document.querySelector("#ammo-value");
const mobCounter = document.querySelector("#mob-counter");
const smallbombCounter = document.querySelector(".collectible-counter-left");
const smallbombCounterImage = document.querySelector("#smallbomb-counter-image");
const smallbombCounterValue = document.querySelector("#smallbomb-counter-value");
const rainbowCounter = document.querySelector(".collectible-counter-right");
const rainbowCounterImage = document.querySelector("#rainbow-counter-image");
const rainbowCounterValue = document.querySelector("#rainbow-counter-value");
const craftingStation = document.querySelector("#crafting-station");
const craftSmallbombImage = document.querySelector("#craft-smallbomb-image");
const craftSmallbombCount = document.querySelector("#craft-smallbomb-count");
const craftRainbowImage = document.querySelector("#craft-rainbow-image");
const craftRainbowCount = document.querySelector("#craft-rainbow-count");
const craftInstructions = document.querySelector("#craft-instructions");
const crosshair = document.querySelector(".crosshair");
const mapFileInput = document.querySelector("#map-file");
const enemyFileInput = document.querySelector("#enemy-file");
const mapFileStatus = document.querySelector("#map-file-status");
const enemyFileStatus = document.querySelector("#enemy-file-status");
const playerFileStatus = document.querySelector("#player-file-status");
const treeFileStatus = document.querySelector("#tree-file-status");

let scene;
let camera;
let renderer;
let weaponPreviewRenderer;
let weaponPreviewScene;
let weaponPreviewCamera;
let weaponPreviewObject = null;
let bombHudRenderer = null;
let bombHudScene = null;
let bombHudCamera = null;
const bombHudIcons = [];
let worldRoot;
let monsterVariants = [];
let explosionTemplate = null;
let explosionAnimations = [];
let witherExplosionTemplate = null;
let witherExplosionAnimations = [];
let bombTemplate = null;
let bombShieldTemplate = null;
let bombShieldObject = null;
let ammoDropTemplate = null;
let moneyDropTemplate = null;
let turretTemplate = null;
let turretCrownTemplate = null;
let turretAnimations = [];
const turretInstances = [];
const ammoDrops = [];
const rareDropTemplates = new Map();
const rareDrops = [];
const rareDropCounts = { smallbomb: 0, rainbow: 0 };
let craftingTableTemplate = null;
let craftingTableObject = null;
let craftingTablePosition = null;
let isCraftingToaster = false;
const shopTemplates = new Map();
const shopPlacements = [];
let shieldShopObject = null;
let shieldShopIntro = null;
let bombHealth = BOMB_MAX_HEALTH;
let bombShieldHealth = 0;
let bombShieldPurchased = false;
let magnetPurchased = false;
let bombPosition = null;
let bombObject = null;
let bombExplosionWave = null;
let bulletTemplate = null;
let rocketTemplate = null;
let rocketExplosionTemplate = null;
let rocketExplosionAnimations = [];
const activeProjectiles = [];
const hostileProjectiles = [];
const activeRainbowParticleEffects = new Set();
const soundEffectPlayback = new Map();
let turretSoundPlaybackLayer = null;
let treeTemplate = null;
let mysteryBoxTemplate = null;
let mysteryBoxAnimations = [];
let mysteryBoxObject = null;
let mysteryBoxPosition = null;
let mysteryBoxMixer = null;
let mysteryBoxOpenAction = null;
let isMysteryBoxOpening = false;
let pendingMysteryBoxWeaponId = null;
let mysteryBoxPreview = null;
let mysteryBoxPreviewHeight = 1.5;
let mysteryBoxRouletteElapsed = 0;
let mysteryBoxRouletteIndex = 0;
let mysteryBoxPreviewRotation = 0;
let weaponRewardLoadPromise = null;
let mysteryBoxIsHeldOpen = false;
let mysteryBoxIsClosing = false;
let mysteryBoxRewardRevealed = false;
let mysteryBoxHoldElapsed = 0;
let playerTemplate = null;
let playerAnimations = [];
let playerObject;
let equippedWeaponObject = null;
const weaponTemplates = new Map();
const weaponLoadPromises = new Map();
const weaponThumbnailUrls = new Map();
const ownedWeaponIds = new Set(["pistol"]);
let currentWeaponId = "pistol";
let masterVolume = 1;
let isTommyGunTriggerHeld = false;
let weaponFireCooldown = 0;
let reloadTimer = 0;
let reloadingWeaponId = null;
let lastEmptyAmmoMessageTime = 0;
let playerPosition = new THREE.Vector3(0, 0, 4);
let playerYaw = 0;
let playerGroundHeight = 0;
let playerVerticalVelocity = 0;
let isPlayerGrounded = true;
let cameraYaw = 0;
let cameraSideIndex = 0;
let cameraPitch = CAMERA_START_PITCH;
let cameraDistance = CAMERA_START_DISTANCE;
let worldBounds = { halfWidth: 10.5, halfDepth: 10.5 };
let terrainRayTop = 13;
let terrainRayBottom = -1;
let mapColliders = [];
let mapGroundMesh = null;
let treeInstancesRoot;
let shopObjects;
const actorMixers = new Set();
const unavailableSoundEffects = new Set();
const reportedSoundErrors = new Set();
const staticObstacles = [];
let level = 1;
let roundIntermissionRemaining = null;
let health = PLAYER_MAX_HEALTH;
let dabloons = STARTING_DABLOONS;
let activeMonsters = [];
let bossCreeperSpawnRemaining = 0;
let isPlaying = false;
let isPaused = false;
let isMapReady = false;
let isIntroOrbiting = false;
let introOrbitElapsed = 0;
let hadPointerLock = false;
let messageTimeout;

const keys = new Set();
const raycaster = new THREE.Raycaster();
const groundRaycaster = new THREE.Raycaster();
const groundNormalMatrix = new THREE.Matrix3();
const clock = new THREE.Clock();

try {
    initializeScene();
    playerObject = createPlaceholderPlayer();
    playerObject.position.copy(playerPosition);
    scene.add(playerObject);
    updateCamera();
    mapFileInput.addEventListener("change", () => importMapFile(mapFileInput.files[0]));
    enemyFileInput.addEventListener("change", () => importEnemyFile(enemyFileInput.files[0]));
    loadInitialModels();
    renderer.setAnimationLoop(render);
} catch (error) {
    console.error("Unable to initialize the 3D game.", error);
    gameError.hidden = false;
    gameError.textContent = "The 3D game could not start. Try opening this page in a modern browser.";
}

function initializeWeaponPreview() {
    try {
        weaponPreviewRenderer = new THREE.WebGLRenderer({
            canvas: weaponPreviewCanvas,
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        });
        weaponPreviewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        weaponPreviewRenderer.setSize(126, 88, false);
        weaponPreviewScene = new THREE.Scene();
        weaponPreviewCamera = new THREE.PerspectiveCamera(35, 126 / 88, 0.1, 20);
        weaponPreviewCamera.position.set(1.1, 0.8, 2.1);
        weaponPreviewCamera.lookAt(0, 0, 0);
        weaponPreviewScene.add(new THREE.AmbientLight(0xffffff, 3));
        weaponPreviewScene.add(new THREE.HemisphereLight(0xffffff, 0x47344f, 2.5));
        const keyLight = new THREE.DirectionalLight(0xffffff, 4);
        keyLight.position.set(2, 4, 3);
        weaponPreviewScene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0xffffff, 2);
        fillLight.position.set(-2, 1, 2);
        weaponPreviewScene.add(fillLight);
    } catch (error) {
        console.error("Unable to initialize the weapon preview.", error);
        document.querySelector(".weapon-preview").hidden = true;
    }
}

function onVolumeChange() {
    masterVolume = Number(volumeSlider.value) / 100;
    volumeValue.value = `${volumeSlider.value}%`;
    for (const [soundId, playback] of soundEffectPlayback) {
        setSoundPlaybackVolume(soundId, playback);
    }
}

function setSoundPlaybackVolume(soundId, playback) {
    const volume = SOUND_EFFECTS[soundId].volume * masterVolume;
    playback.volume = volume;
    if (soundId === "turretShoot" && turretSoundPlaybackLayer) {
        turretSoundPlaybackLayer.volume = volume;
    }
}

async function loadInitialModels() {
    await Promise.all([
        loadFixedMapModel(),
        loadFixedPlayerModel(),
        loadFixedBombModel(),
        loadFixedTurretModel(),
        loadFixedTurretCrownModel(),
        loadFixedBombShieldModel(),
        loadFixedMonsterModel(),
        loadFixedCreeperModel(),
        loadFixedWitherModel(),
        loadFixedWitherSkeletonModel(),
        loadFixedExplosionModel(),
        loadFixedWitherExplosionModel(),
        loadFixedBulletModel(),
        loadFixedAmmoDropModel(),
        loadFixedMoneyDropModel(),
        loadRareDropModels(),
        loadCraftingTableModel(),
        loadFixedShopModels(),
        loadFixedRocketModels(),
        loadStarterWeapon(),
        loadFixedTreeModel(),
        loadFixedMysteryBoxModel()
    ]);
    enemyFileStatus.textContent = monsterVariants.length
        ? `Loaded ${monsterVariants.map((variant) => variant.name).join(" and ")}${explosionTemplate ? " with explosion effect" : ""}`
        : "Using placeholder monsters";
    preloadMysteryBoxWeapons().then((results) => {
        if (results.some((result) => result.status === "rejected")) {
            console.error("Some mystery-box weapon models could not be loaded.");
        }
        for (const weapon of WEAPON_DEFINITIONS) cacheWeaponThumbnail(weapon);
        updateWeaponQuickSelect();
    });
    loadWeaponModel("toaster")
        .catch((error) => console.error("Unable to load the Toaster weapon model.", error));
    for (const dropType of rareDropTemplates.keys()) cacheRareDropThumbnail(dropType);
    updateHud();
    placeShopModels();
    for (const weapon of WEAPON_DEFINITIONS) cacheWeaponThumbnail(weapon);
    updateWeaponQuickSelect();
    startIntroCameraOrbit();
}

function startIntroCameraOrbit() {
    if (document.hidden) {
        document.addEventListener("visibilitychange", startIntroCameraOrbit);
        return;
    }
    document.removeEventListener("visibilitychange", startIntroCameraOrbit);
    introOrbitElapsed = 0;
    isIntroOrbiting = true;
    gameScreen.hidden = true;
}

function initializeScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x171323);
    scene.fog = new THREE.Fog(0x171323, 70, 260);

    camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
    camera.position.set(0, 10, 13);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    frame.prepend(renderer.domElement);
    resizeScene();
    initializeWeaponPreview();

    scene.add(new THREE.HemisphereLight(0xdac8ff, 0x292038, 2.1));
    const lantern = new THREE.PointLight(0xffc87a, 36, 22);
    lantern.position.set(0, 5, 1);
    lantern.castShadow = true;
    scene.add(lantern);

    worldRoot = new THREE.Group();
    scene.add(worldRoot);
    treeInstancesRoot = new THREE.Group();
    scene.add(treeInstancesRoot);
    shopObjects = new THREE.Group();
    scene.add(shopObjects);
    mysteryBoxObject = new THREE.Group();
    scene.add(mysteryBoxObject);
    bombPosition = new THREE.Vector3();
    bombObject = new THREE.Group();
    bombObject.visible = false;
    scene.add(bombObject);

    window.addEventListener("resize", resizeScene);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", (event) => keys.delete(event.code));
    document.addEventListener("mousemove", onCameraMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("pointerlockerror", onPointerLockError);
    frame.addEventListener("pointerdown", onGamePointerDown);
    document.addEventListener("pointerup", onGamePointerUp);
    frame.addEventListener("wheel", onCameraZoom, { passive: false });
    startButton.addEventListener("click", onStartButtonClick);
    skipToLastLevelButton.addEventListener("click", onSkipToLastLevelClick);
    fullscreenButton.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", updateFullscreenButton);
    volumeSlider.addEventListener("input", onVolumeChange);
}

async function toggleFullscreen(event) {
    event?.stopPropagation();
    try {
        if (document.fullscreenElement === frame) {
            await document.exitFullscreen();
        } else {
            await frame.requestFullscreen();
        }
    } catch (error) {
        console.error("Unable to change fullscreen mode.", error);
        showMessage("Fullscreen is unavailable in this browser.");
    }
}

function updateFullscreenButton() {
    const isFullscreen = document.fullscreenElement === frame;
    fullscreenButton.textContent = isFullscreen ? "Exit fullscreen" : "Fullscreen";
    fullscreenButton.setAttribute(
        "aria-label",
        isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
    );
    resizeScene();
}

function createDefaultWorld() {
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(44, 44),
        new THREE.MeshStandardMaterial({ color: 0x393044, roughness: 0.92 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    worldRoot.add(floor);
    mapGroundMesh = floor;

    const grid = new THREE.GridHelper(44, 22, 0x766488, 0x554765);
    grid.position.y = 0.015;
    worldRoot.add(grid);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x51435f, roughness: 0.88 });
    addWall(0, 2, -12, 24, 4, 1, wallMaterial);
    addWall(0, 2, 12, 24, 4, 1, wallMaterial);
    addWall(-12, 2, 0, 1, 4, 24, wallMaterial);
    addWall(12, 2, 0, 1, 4, 24, wallMaterial);

    for (const [x, z] of [[-6, -4], [6, -6], [-7, 5], [7, 4]]) {
        const pillar = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 3.6, 1.2),
            wallMaterial
        );
        pillar.position.set(x, 1.8, z);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        worldRoot.add(pillar);
    }

    worldBounds = { halfWidth: 10.5, halfDepth: 10.5 };
    terrainRayTop = 13;
    terrainRayBottom = -1;
    mapColliders = [];
    worldRoot.traverse((part) => {
        if (part.isMesh) mapColliders.push(part);
    });
    clearTreeInstances();
    clearMysteryBox();
}

function onStartButtonClick(event) {
    event.stopPropagation();
    if (!isMapReady) return;
    if (isPaused) {
        resumeGame();
        return;
    }
    startButton.textContent = "Enter the dungeon";
    startGame();
}

async function onSkipToLastLevelClick(event) {
    event.stopPropagation();
    if (!isMapReady || isPaused) return;
    startButton.disabled = true;
    skipToLastLevelButton.disabled = true;
    try {
        await loadWeaponModel("toaster");
        startGame(true);
    } catch (error) {
        console.error("Unable to start the final-level test.", error);
        screenDescription.textContent = "Could not load the Toaster for the final-level test.";
    } finally {
        startButton.disabled = false;
        skipToLastLevelButton.disabled = false;
    }
}

function addWall(x, y, z, width, height, depth, material) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    wall.position.set(x, y, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    worldRoot.add(wall);
}

async function readGLBFile(file) {
    if (!file) return null;
    if (!file.name.toLowerCase().endsWith(".glb")) {
        throw new Error("Choose a .glb file exported from Blender.");
    }

    const data = await file.arrayBuffer();
    return new Promise((resolve, reject) => {
        new GLTFLoader().parse(data, "", resolve, reject);
    });
}

async function importMapFile(file) {
    if (!file) return;
    mapFileStatus.textContent = "Loading map...";
    try {
        const gltf = await readGLBFile(file);
        if (!gltf) return;
        applyMapModel(gltf.scene);
        mapFileStatus.textContent = file.name;
        showMessage("Map loaded");
    } catch (error) {
        console.error("Unable to load the selected map.", error);
        mapFileStatus.textContent = `Could not load ${file.name}`;
    } finally {
        mapFileInput.value = "";
    }
}

async function loadFixedMapModel() {
    mapFileStatus.textContent = "Loading models/MAP.glb...";
    try {
        const gltf = await new GLTFLoader().loadAsync(MAP_MODEL_URL.href);
        applyMapModel(gltf.scene);
        mapFileStatus.textContent = "Loaded models/MAP.glb";
    } catch (error) {
        console.error(`Unable to load the fixed map model at ${MAP_MODEL_URL.href}.`, error);
        mapFileStatus.textContent = "Could not load models/MAP.glb; using built-in map.";
        clearWorld();
        createDefaultWorld();
        resetPlayerPosition();
        placeBomb();
        placeMysteryBox();
        placeShopModels();
        placeCraftingTable();
        populateTrees();
    }
}

function applyMapModel(map) {
    const terrainMeshes = [];
    map.traverse((part) => {
        if (part.isMesh && !part.name.toLowerCase().includes("skybox")) {
            terrainMeshes.push(part);
        }
    });
    if (!terrainMeshes.length) {
        throw new Error("The map has no terrain meshes.");
    }

    map.updateMatrixWorld(true);
    const initialBounds = getMeshBounds(terrainMeshes);
    const initialSize = initialBounds.getSize(new THREE.Vector3());
    const horizontalSize = Math.max(initialSize.x, initialSize.z);
    if (!Number.isFinite(horizontalSize) || horizontalSize <= 0) {
        throw new Error("The map file has no usable terrain geometry.");
    }

    prepareModel(map);
    map.scale.setScalar(MAP_MAX_SIZE / horizontalSize);
    map.updateMatrixWorld(true);
    const bounds = getMeshBounds(terrainMeshes);
    const center = bounds.getCenter(new THREE.Vector3());
    const groundMesh = terrainMeshes.reduce((largest, mesh) => {
        const meshSize = new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3());
        const largestSize = new THREE.Box3().setFromObject(largest).getSize(new THREE.Vector3());
        return meshSize.x * meshSize.z > largestSize.x * largestSize.z ? mesh : largest;
    });
    map.position.x -= center.x;
    map.position.z -= center.z;
    map.position.y -= bounds.min.y;
    map.updateMatrixWorld(true);

    clearWorld();
    worldRoot.add(map);
    mapColliders = terrainMeshes;
    mapGroundMesh = groundMesh;
    const mapBounds = new THREE.Box3().setFromObject(mapGroundMesh);
    const mapSize = mapBounds.getSize(new THREE.Vector3());
    terrainRayTop = mapBounds.max.y + 10;
    terrainRayBottom = mapBounds.min.y - 2;
    worldBounds = {
        halfWidth: Math.max(2, mapSize.x / 2 - 1),
        halfDepth: Math.max(2, mapSize.z / 2 - 1)
    };
    resetPlayerPosition();
    placeBomb();
    placeMysteryBox();
    placeShopModels();
    placeCraftingTable();
    populateTrees();
    cameraYaw = 0;
    clearMonsters();
    if (isPlaying) startLevel();
}

function enableGameStart() {
    isMapReady = true;
    screenDescription.hidden = false;
    startButton.hidden = false;
    controlsHint.hidden = false;
    screenTitle.textContent = "";
    screenDescription.textContent = `Clear all ${LEVEL_COUNT} levels`;
    startButton.disabled = false;
    startButton.textContent = "Defend the bomb stay alive!";
    skipToLastLevelButton.hidden = false;
    skipToLastLevelButton.disabled = false;
}

function getMeshBounds(meshes) {
    const bounds = new THREE.Box3().makeEmpty();
    for (const mesh of meshes) bounds.expandByObject(mesh);
    return bounds;
}

async function importEnemyFile(file) {
    if (!file) return;
    enemyFileStatus.textContent = "Loading model...";
    try {
        const gltf = await readGLBFile(file);
        if (!gltf) return;
        const model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        if (!Number.isFinite(size.y) || size.y <= 0) {
            throw new Error("The model file has no usable 3D geometry.");
        }
        prepareModel(model);

        monsterVariants = [{ model, animations: gltf.animations, name: file.name }];
        replaceActiveMonsters();
        enemyFileStatus.textContent = file.name;
        showMessage("Enemy model loaded");
    } catch (error) {
        console.error("Unable to load the selected enemy model.", error);
        enemyFileStatus.textContent = `Could not load ${file.name}`;
    } finally {
        enemyFileInput.value = "";
    }
}

async function loadFixedPlayerModel() {
    playerFileStatus.textContent = "Loading models/pusheen.glb...";
    try {
        const gltf = await new GLTFLoader().loadAsync(PLAYER_MODEL_URL.href);
        const model = gltf.scene;
        const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
        if (!Number.isFinite(size.y) || size.y <= 0) {
            throw new Error("The model file has no usable 3D geometry.");
        }

        prepareModel(model);
        playerTemplate = model;
        playerAnimations = gltf.animations;
        replacePlayerModel();
        playerFileStatus.textContent = "Loaded models/pusheen.glb";
    } catch (error) {
        console.error(`Unable to load the fixed player model at ${PLAYER_MODEL_URL.href}.`, error);
        playerFileStatus.textContent = "Could not load models/pusheen.glb; using placeholder.";
    }
}

async function loadFixedBombModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(BOMB_MODEL_URL.href);
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        if (!Number.isFinite(size.y) || size.y <= 0) {
            throw new Error("The bomb model has no usable 3D geometry.");
        }
        prepareModel(gltf.scene);
        bombTemplate = gltf.scene;
        initializeBombHud();
        placeBomb();
    } catch (error) {
        console.error(`Unable to load the bomb model at ${BOMB_MODEL_URL.href}.`, error);
        showMessage("Could not load models/bomb.glb.");
    }
}

async function loadFixedBombShieldModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(BOMB_SHIELD_MODEL_URL.href);
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        if (!Number.isFinite(size.length()) || size.length() <= 0) {
            throw new Error("The bomb shield model has no usable 3D geometry.");
        }
        prepareModel(gltf.scene);
        bombShieldTemplate = gltf.scene;
    } catch (error) {
        console.error(`Unable to load the bomb shield model at ${BOMB_SHIELD_MODEL_URL.href}.`, error);
        showMessage("Could not load models/blue shield.glb.");
    }
}

async function loadFixedTurretModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(TURRET_MODEL_URL.href);
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        if (!Number.isFinite(size.y) || size.y <= 0) {
            throw new Error("The turret model has no usable 3D geometry.");
        }
        prepareModel(gltf.scene);
        turretTemplate = gltf.scene;
        turretAnimations = gltf.animations;
        if (!turretAnimations.some((animation) => /fire/i.test(animation.name))) {
            console.warn("The turret model has no firing animation.");
        }
    } catch (error) {
        console.error(`Unable to load the turret model at ${TURRET_MODEL_URL.href}.`, error);
        showMessage("Could not load models/turret.glb.");
    }
}

async function loadFixedTurretCrownModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(TURRET_CROWN_MODEL_URL.href);
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        if (![size.x, size.y, size.z].every((dimension) =>
            Number.isFinite(dimension) && dimension > 0
        )) {
            throw new Error("The turret crown model has no usable 3D geometry.");
        }
        prepareModel(gltf.scene);
        gltf.scene.traverse((part) => {
            if (!part.isMesh) return;
            const materials = Array.isArray(part.material) ? part.material : [part.material];
            for (const material of materials) {
                if (!(material instanceof THREE.MeshStandardMaterial)) continue;
                material.metalness = 0.2;
                material.roughness = 0.4;
                material.emissive.set(0x4d3000);
                material.emissiveIntensity = 0.45;
                material.needsUpdate = true;
            }
        });
        turretCrownTemplate = gltf.scene;
    } catch (error) {
        console.error(`Unable to load the turret crown model at ${TURRET_CROWN_MODEL_URL.href}.`, error);
        showMessage("Could not load Crown.glb; turret upgrades are unavailable.");
    }
}

function initializeBombHud() {
    try {
        bombHudRenderer = new THREE.WebGLRenderer({
            canvas: bombHealthCanvas,
            alpha: true,
            antialias: true
        });
        bombHudRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        bombHudRenderer.setSize(180, 42, false);
        bombHudScene = new THREE.Scene();
        bombHudCamera = new THREE.OrthographicCamera(-2.2, 2.2, 0.52, -0.52, 0.1, 20);
        bombHudCamera.position.set(0, 0, 10);
        bombHudCamera.lookAt(0, 0, 0);
        bombHudScene.add(new THREE.AmbientLight(0xffffff, 2.4));
        bombHudScene.add(new THREE.HemisphereLight(0xffffff, 0x554466, 1.4));
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
        keyLight.position.set(2, 4, 6);
        bombHudScene.add(keyLight);

        const bounds = new THREE.Box3().setFromObject(bombTemplate);
        const size = bounds.getSize(new THREE.Vector3());
        const longestSide = Math.max(size.x, size.y, size.z);
        if (!Number.isFinite(longestSide) || longestSide <= 0) {
            throw new Error("The bomb model has no usable 3D geometry for the HUD.");
        }
        const scale = 0.58 / longestSide;
        const center = bounds.getCenter(new THREE.Vector3());
        const bombIconCount = BOMB_MAX_HEALTH / BOMB_HEALTH_PER_ICON;
        for (let index = 0; index < bombIconCount; index += 1) {
            const icon = cloneSkinnedModel(bombTemplate);
            const materials = [];
            icon.traverse((part) => {
                if (!part.isMesh) return;
                part.castShadow = false;
                part.receiveShadow = false;
                const sourceMaterials = Array.isArray(part.material) ? part.material : [part.material];
                const iconMaterials = sourceMaterials.map((sourceMaterial) => {
                    const material = sourceMaterial.clone();
                    material.transparent = true;
                    materials.push(material);
                    return material;
                });
                part.material = Array.isArray(part.material) ? iconMaterials : iconMaterials[0];
            });
            icon.scale.setScalar(scale);
            icon.position.set(
                (index - (bombIconCount - 1) / 2) * 0.64 - center.x * scale,
                -center.y * scale,
                -center.z * scale
            );
            bombHudScene.add(icon);
            bombHudIcons.push({ icon, materials });
        }

        bombHealthFallback.hidden = true;
        updateHud();
    } catch (error) {
        console.error("Unable to initialize the bomb health HUD.", error);
        bombHudRenderer?.dispose();
        bombHudRenderer = null;
        bombHudScene = null;
        bombHudCamera = null;
        bombHudIcons.length = 0;
        bombHealthFallback.hidden = false;
    }
}

async function loadFixedMonsterModel() {
    enemyFileStatus.textContent = "Loading enemies/half life zombie.glb...";
    try {
        const gltf = await new GLTFLoader().loadAsync(MONSTER_MODEL_URL.href);
        const model = gltf.scene;
        const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
        if (!Number.isFinite(size.y) || size.y <= 0) {
            throw new Error("The model file has no usable 3D geometry.");
        }

        prepareModel(model);
        monsterVariants.push({
            model,
            animations: gltf.animations,
            name: "Half-Life Zombie"
        });
    } catch (error) {
        console.error(`Unable to load the fixed enemy model at ${MONSTER_MODEL_URL.href}.`, error);
        enemyFileStatus.textContent = "Could not load the enemy model; using placeholders.";
    }
}

async function loadFixedCreeperModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(CREEPER_MODEL_URL.href);
        const model = gltf.scene;
        const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
        if (!Number.isFinite(size.y) || size.y <= 0) {
            throw new Error("The model file has no usable 3D geometry.");
        }

        prepareModel(model);
        monsterVariants.push({
            model,
            animations: gltf.animations,
            name: "Minecraft Creeper",
            proceduralWalk: true,
            facingOffset: Math.PI
        });
    } catch (error) {
        console.error(`Unable to load the creeper model at ${CREEPER_MODEL_URL.href}.`, error);
        enemyFileStatus.textContent = "Could not load the Creeper model.";
    }
}

async function loadFixedWitherModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(WITHER_MODEL_URL.href);
        const size = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3());
        if (!Number.isFinite(size.y) || size.y <= 0) {
            throw new Error("The Wither model has no usable 3D geometry.");
        }
        if (!gltf.animations.some((clip) => /shoot/i.test(clip.name))) {
            throw new Error("The Wither model is missing its shooting animation.");
        }

        prepareModel(gltf.scene);
        const skullProjectile = createWitherSkullTemplate(gltf.scene);
        if (!skullProjectile) {
            throw new Error("The Wither model is missing its right-side skull mesh.");
        }
        monsterVariants.push({
            model: gltf.scene,
            animations: gltf.animations.filter((clip) => !/shoot/i.test(clip.name)),
            name: "Wither",
            isBoss: true,
            facingOffset: Math.PI,
            projectileTemplate: skullProjectile.template,
            projectileForward: skullProjectile.forward,
            projectileNodeName: "Object_26"
        });
    } catch (error) {
        console.error(`Unable to load the Wither model at ${WITHER_MODEL_URL.href}.`, error);
        enemyFileStatus.textContent = "Could not load enemies/wither.glb; the final boss will use a placeholder.";
    }
}

async function loadFixedWitherSkeletonModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(WITHER_SKELETON_MODEL_URL.href);
        const size = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3());
        if (!Number.isFinite(size.y) || size.y <= 0) {
            throw new Error("The Wither Skeleton model has no usable 3D geometry.");
        }

        prepareModel(gltf.scene);
        monsterVariants.push({
            model: gltf.scene,
            animations: gltf.animations,
            name: "Wither Skeleton",
            facingOffset: Math.PI
        });
    } catch (error) {
        console.error(`Unable to load the Wither Skeleton model at ${WITHER_SKELETON_MODEL_URL.href}.`, error);
        enemyFileStatus.textContent = "Could not load enemies/wither skeleton.glb; summoned skeletons will use placeholders.";
    }
}

async function loadFixedExplosionModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(EXPLOSION_MODEL_URL.href);
        if (!gltf.animations.length) {
            throw new Error("The explosion model has no animation clips.");
        }
        explosionTemplate = gltf.scene;
        explosionAnimations = gltf.animations;
        prepareModel(explosionTemplate);
    } catch (error) {
        console.error(`Unable to load the explosion effect at ${EXPLOSION_MODEL_URL.href}.`, error);
    }
}

async function loadFixedWitherExplosionModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(WITHER_EXPLOSION_MODEL_URL.href);
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        if (!Number.isFinite(size.length()) || size.length() <= 0) {
            throw new Error("The Wither explosion model has no usable 3D geometry.");
        }
        prepareModel(gltf.scene);
        witherExplosionTemplate = gltf.scene;
        witherExplosionAnimations = gltf.animations;
    } catch (error) {
        console.error(`Unable to load the Wither explosion at ${WITHER_EXPLOSION_MODEL_URL.href}.`, error);
    }
}

async function loadFixedBulletModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(BULLET_MODEL_URL.href);
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        const longestSide = Math.max(size.x, size.y, size.z);
        if (!Number.isFinite(longestSide) || longestSide <= 0) {
            throw new Error("The bullet model has no usable 3D geometry.");
        }
        prepareModel(gltf.scene);
        bulletTemplate = gltf.scene;
    } catch (error) {
        console.error(`Unable to load the bullet model at ${BULLET_MODEL_URL.href}.`, error);
        showMessage("Could not load weapons/bullet.glb.");
    }
}

async function loadFixedAmmoDropModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(AMMO_DROP_MODEL_URL.href);
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        const longestSide = Math.max(size.x, size.y, size.z);
        if (!Number.isFinite(longestSide) || longestSide <= 0) {
            throw new Error("The ammo box has no usable 3D geometry.");
        }
        prepareModel(gltf.scene);
        ammoDropTemplate = gltf.scene;
    } catch (error) {
        console.error(`Unable to load the ammo box at ${AMMO_DROP_MODEL_URL.href}.`, error);
        const fallback = new THREE.Group();
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.65, 0.45, 0.45),
            new THREE.MeshStandardMaterial({ color: 0x78b84a, roughness: 0.7 })
        );
        box.position.y = 0.24;
        box.castShadow = true;
        box.receiveShadow = true;
        fallback.add(box);
        ammoDropTemplate = fallback;
        showMessage("Could not load mob drops/ammobox.glb; using a simple ammo box.");
    }
}

async function loadFixedMoneyDropModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(MONEY_DROP_MODEL_URL.href);
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        const longestSide = Math.max(size.x, size.y, size.z);
        if (!Number.isFinite(longestSide) || longestSide <= 0) {
            throw new Error("The money drop has no usable 3D geometry.");
        }
        prepareModel(gltf.scene);
        moneyDropTemplate = gltf.scene;
    } catch (error) {
        console.error(`Unable to load the money drop at ${MONEY_DROP_MODEL_URL.href}.`, error);
        showMessage("Could not load mob drops/money.glb.");
    }
}

async function loadRareDropModels() {
    const dropAssets = [
        ["smallbomb", SMALLBOMB_DROP_MODEL_URL],
        ["rainbow", RAINBOW_DROP_MODEL_URL]
    ];
    await Promise.all(dropAssets.map(async ([dropType, url]) => {
        try {
            const gltf = await new GLTFLoader().loadAsync(url.href);
            const bounds = new THREE.Box3().setFromObject(gltf.scene);
            const size = bounds.getSize(new THREE.Vector3());
            const longestSide = Math.max(size.x, size.y, size.z);
            if (!Number.isFinite(longestSide) || longestSide <= 0) {
                throw new Error("The collectible model has no usable 3D geometry.");
            }
            prepareModel(gltf.scene);
            rareDropTemplates.set(dropType, gltf.scene);
        } catch (error) {
            console.error(`Unable to load the ${dropType} collectible at ${url.href}.`, error);
        }
    }));
    for (const dropType of rareDropTemplates.keys()) cacheRareDropThumbnail(dropType);
}

async function loadCraftingTableModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(CRAFTING_TABLE_MODEL_URL.href);
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        const longestSide = Math.max(size.x, size.y, size.z);
        if (!Number.isFinite(longestSide) || longestSide <= 0) {
            throw new Error("The crafting table has no usable 3D geometry.");
        }
        prepareModel(gltf.scene);
        craftingTableTemplate = gltf.scene;
        placeCraftingTable();
    } catch (error) {
        console.error(`Unable to load the crafting table at ${CRAFTING_TABLE_MODEL_URL.href}.`, error);
    }
}

function placeCraftingTable() {
    if (!craftingTableTemplate || !mapGroundMesh) return;
    removeStaticObstacle("crafting-table");
    if (craftingTableObject) scene.remove(craftingTableObject);
    craftingTableObject = null;
    craftingTablePosition = null;

    const placement = findTerrainSpawn(playerPosition.x + 24, playerPosition.z);
    if (!placement) {
        console.error("Could not find walkable terrain for the crafting table.");
        return;
    }

    const model = cloneSkinnedModel(craftingTableTemplate);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error("The crafting table has no usable 3D geometry.");
        return;
    }
    const scale = 1.5 / longestSide;
    model.scale.multiplyScalar(scale);
    model.position.set(
        -((bounds.min.x + bounds.max.x) / 2) * scale,
        -bounds.min.y * scale,
        -((bounds.min.z + bounds.max.z) / 2) * scale
    );
    craftingTableObject = new THREE.Group();
    craftingTableObject.add(model);
    craftingTableObject.position.set(placement.x, placement.height, placement.z);
    scene.add(craftingTableObject);
    craftingTablePosition = new THREE.Vector3(placement.x, placement.height, placement.z);
    addStaticObstacle(
        "crafting-table",
        craftingTablePosition,
        Math.max(size.x, size.z) * scale * 0.45
    );
}

async function loadFixedShopModels() {
    const shopAssets = [
        ["ammo", AMMO_SHOP_MODEL_URL],
        ["healing", HEALING_SHOP_MODEL_URL],
        ["turret", TURRET_SHOP_MODEL_URL],
        ["shield", SHIELD_SHOP_MODEL_URL],
        ["magnet", MAGNET_MODEL_URL],
        ["for-sale-sign", FOR_SALE_SIGN_MODEL_URL]
    ];
    await Promise.all(shopAssets.map(async ([shopType, url]) => {
        try {
            const loader = new GLTFLoader();
            if (shopType === "shield") {
                loader.register((parser) => ({
                    name: "KHR_materials_pbrSpecularGlossiness",
                    beforeRoot() {
                        for (const material of parser.json.materials ?? []) {
                            const legacy = material.extensions?.KHR_materials_pbrSpecularGlossiness;
                            if (!legacy || material.pbrMetallicRoughness) continue;
                            // Approximate this legacy material with a supported glTF material.
                            material.pbrMetallicRoughness = {
                                baseColorFactor: legacy.diffuseFactor ?? [1, 1, 1, 1],
                                baseColorTexture: legacy.diffuseTexture,
                                metallicFactor: 0,
                                roughnessFactor: 1 - (legacy.glossinessFactor ?? 1)
                            };
                        }
                    }
                }));
            }
            const gltf = await loader.loadAsync(url.href);
            const bounds = new THREE.Box3().setFromObject(gltf.scene);
            const size = bounds.getSize(new THREE.Vector3());
            if (!Number.isFinite(size.y) || size.y <= 0) {
                throw new Error("The shop model has no usable 3D geometry.");
            }
            prepareModel(gltf.scene);
            if (shopType === "turret") illuminateTurretShopCrown(gltf.scene);
            if (shopType === "magnet" || shopType === "shield") illuminateTexturedModel(gltf.scene);
            shopTemplates.set(shopType, gltf.scene);
        } catch (error) {
            console.error(`Unable to load the ${shopType} shop at ${url.href}.`, error);
            showMessage(`Could not load the ${shopType} shop.`);
        }
    }));
    placeShopModels();
}

function illuminateTurretShopCrown(shopModel) {
    let crown = null;
    shopModel.traverse((part) => {
        if (!crown && /crown/i.test(part.name)) crown = part;
    });
    if (!crown) {
        console.warn("The turret shop model does not contain a named crown.");
        return;
    }

    let crownMeshFound = false;
    crown.traverse((part) => {
        if (!part.isMesh) return;
        crownMeshFound = true;
        const sourceMaterials = Array.isArray(part.material) ? part.material : [part.material];
        const materials = sourceMaterials.map((sourceMaterial) => {
            if (!sourceMaterial?.emissive) return sourceMaterial;
            const material = sourceMaterial.clone();
            material.emissive.set(0xffd66b);
            material.emissiveMap = null;
            material.emissiveIntensity = 0.8;
            material.needsUpdate = true;
            return material;
        });
        part.material = Array.isArray(part.material) ? materials : materials[0];
    });
    if (!crownMeshFound) console.warn("The turret shop crown has no mesh to illuminate.");
}

function illuminateTexturedModel(model) {
    model.traverse((part) => {
        if (!part.isMesh) return;
        const sourceMaterials = Array.isArray(part.material) ? part.material : [part.material];
        const materials = sourceMaterials.map((sourceMaterial) => {
            if (!sourceMaterial?.emissive) return sourceMaterial;
            const material = sourceMaterial.clone();
            material.emissive.set(0xffffff);
            material.emissiveMap = material.map;
            material.emissiveIntensity = 0.45;
            material.needsUpdate = true;
            return material;
        });
        part.material = Array.isArray(part.material) ? materials : materials[0];
    });
}

function placeShopModels() {
    if (!shopObjects) return;
    removeShieldShop();
    shopObjects.clear();
    removeStaticObstaclesWithPrefix("shop-");
    shopPlacements.length = 0;
    if (!mapGroundMesh) return;

    const shopDefinitions = [
        { type: "healing", offsetX: -16, offsetZ: -4 },
        { type: "ammo", offsetX: -16, offsetZ: 4 },
        { type: "magnet", offsetX: 2.3, offsetZ: 16 },
        { type: "turret", offsetX: 12, offsetZ: 28 }
    ];
    for (const shop of shopDefinitions) {
        const template = shopTemplates.get(shop.type);
        if (!template) continue;

        const placement = findTerrainSpawn(
            playerPosition.x + shop.offsetX,
            playerPosition.z + shop.offsetZ
        );
        if (!placement) {
            console.error(`Could not find walkable terrain for the ${shop.type} shop.`);
            continue;
        }

        const model = cloneSkinnedModel(template);
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const targetHeight = shop.type === "turret" ? 12 : shop.type === "magnet" ? 1.2 : 3;
        const scale = targetHeight / size.y;
        model.scale.multiplyScalar(scale);
        model.position.set(
            -((bounds.min.x + bounds.max.x) / 2) * scale,
            -bounds.min.y * scale,
            -((bounds.min.z + bounds.max.z) / 2) * scale
        );
        const object = new THREE.Group();
        object.position.set(placement.x, placement.height, placement.z);
        object.rotation.y = shop.type === "turret" ? Math.PI : Math.PI / 2;
        if (shop.type === "magnet") model.position.x += 3;
        object.add(model);
        if (shop.type === "magnet") {
            const signTemplate = shopTemplates.get("for-sale-sign");
            if (signTemplate) {
                const signModel = cloneSkinnedModel(signTemplate);
                const signBounds = new THREE.Box3().setFromObject(signModel);
                const signSize = signBounds.getSize(new THREE.Vector3());
                if (!Number.isFinite(signSize.y) || signSize.y <= 0) {
                    console.error("The for-sale sign has no usable 3D geometry.");
                } else {
                    const signScale = 1.8 / signSize.y;
                    signModel.scale.multiplyScalar(signScale);
                    signModel.position.set(
                        1 - ((signBounds.min.x + signBounds.max.x) / 2) * signScale,
                        -signBounds.min.y * signScale,
                        -((signBounds.min.z + signBounds.max.z) / 2) * signScale
                    );
                    object.add(signModel);
                }
            }
        }
        shopObjects.add(object);
        const collisionRadius = Math.max(size.x, size.z) * scale * 0.45 +
            (shop.type === "magnet" ? 1 : 0);
        shopPlacements.push({
            type: shop.type,
            position: new THREE.Vector3(placement.x, placement.height, placement.z),
            interactionDistance: shop.type === "turret"
                ? Math.max(SHOP_INTERACTION_DISTANCE, collisionRadius + 0.6)
                : SHOP_INTERACTION_DISTANCE
        });
        addStaticObstacle(
            `shop-${shop.type}`,
            shopPlacements[shopPlacements.length - 1].position,
            collisionRadius
        );
    }
}

function findShieldShopPlacement(collisionRadius) {
    if (!bombPosition) return null;
    const offsets = [
        [0, 8],
        [8, 0],
        [0, -8],
        [-8, 0],
        [6, 6],
        [6, -6],
        [-6, 6],
        [-6, -6]
    ];
    for (const [offsetX, offsetZ] of offsets) {
        const x = bombPosition.x + offsetX;
        const z = bombPosition.z + offsetZ;
        const ground = findGroundAt(x, z);
        if (!ground) continue;
        const blocked = staticObstacles.some((obstacle) =>
            Math.hypot(x - obstacle.x, z - obstacle.z) <
                collisionRadius + obstacle.radius + 0.75
        );
        if (!blocked) return { x, z, ...ground };
    }
    return null;
}

function createShieldShop() {
    const template = shopTemplates.get("shield");
    if (!template || !shopObjects) {
        console.error("Cannot create the shield shop because its model is unavailable.");
        showMessage("The bomb shield shop is unavailable.");
        return false;
    }

    const bounds = new THREE.Box3().setFromObject(template);
    const size = bounds.getSize(new THREE.Vector3());
    if (![size.x, size.y, size.z].every((dimension) =>
        Number.isFinite(dimension) && dimension > 0
    )) {
        console.error("The shield shop model has no usable 3D geometry.");
        showMessage("The bomb shield shop could not be placed.");
        return false;
    }

    const scale = SHIELD_SHOP_TARGET_HEIGHT / size.y;
    const collisionRadius = Math.max(
        0.5,
        Math.max(size.x, size.z) * scale * 0.45
    );
    const placement = findShieldShopPlacement(collisionRadius);
    if (!placement) {
        console.error("Could not find walkable, clear terrain for the shield shop.");
        showMessage("There is no clear space near the bomb for the shield shop.");
        return false;
    }

    const model = cloneSkinnedModel(template);
    const center = bounds.getCenter(new THREE.Vector3());
    model.scale.multiplyScalar(scale);
    model.position.set(
        -center.x * scale,
        -bounds.min.y * scale,
        -center.z * scale
    );

    const hoverHeight = placement.height + SHIELD_SHOP_FLOAT_HEIGHT;
    const riseHeight = SHIELD_SHOP_TARGET_HEIGHT + 1 + SHIELD_SHOP_FLOAT_HEIGHT;
    const object = new THREE.Group();
    object.position.set(placement.x, hoverHeight - riseHeight, placement.z);
    object.rotation.y = Math.PI / 2;
    object.userData.hoverHeight = hoverHeight;
    object.userData.riseHeight = riseHeight;
    object.userData.floatTime = 0;
    object.add(model);
    shopObjects.add(object);
    shieldShopObject = object;

    const shopPosition = new THREE.Vector3(placement.x, placement.height, placement.z);
    shopPlacements.push({
        type: "shield",
        position: shopPosition,
        interactionDistance: Math.max(SHOP_INTERACTION_DISTANCE, collisionRadius + 0.6)
    });
    addStaticObstacle("shop-shield", shopPosition, collisionRadius);
    return true;
}

function removeShieldShop() {
    if (shieldShopObject && shopObjects) shopObjects.remove(shieldShopObject);
    shieldShopObject = null;
    shieldShopIntro = null;
    const placementIndex = shopPlacements.findIndex((shop) => shop.type === "shield");
    if (placementIndex >= 0) shopPlacements.splice(placementIndex, 1);
    removeStaticObstacle("shop-shield");
}

function beginShieldShopIntro() {
    if (!shieldShopObject) return false;
    const shop = shopPlacements.find((placement) => placement.type === "shield");
    if (!shop) return false;

    const cameraStartTarget = playerPosition.clone();
    cameraStartTarget.y += PLAYER_HEAD_HEIGHT;
    const focusTarget = shop.position.clone();
    focusTarget.y += SHIELD_SHOP_FLOAT_HEIGHT + SHIELD_SHOP_TARGET_HEIGHT * 0.55;
    const cameraFocusPosition = shop.position.clone().add(new THREE.Vector3(7, 5 + SHIELD_SHOP_FLOAT_HEIGHT, 7));
    const cameraReturnStart = SHIELD_SHOP_RISE_START + SHIELD_SHOP_RISE_DURATION;
    shieldShopIntro = {
        elapsed: 0,
        object: shieldShopObject,
        hoverHeight: shieldShopObject.userData.hoverHeight,
        riseHeight: shieldShopObject.userData.riseHeight,
        cameraStartPosition: camera.position.clone(),
        cameraStartTarget,
        cameraFocusPosition,
        focusTarget,
        cameraReturnStart,
        duration: cameraReturnStart + SHIELD_SHOP_CAMERA_RETURN_DURATION
    };
    mysteryBoxPrompt.hidden = true;
    return true;
}

function updateShieldShopIntro(delta) {
    const intro = shieldShopIntro;
    if (!intro || isPaused) return;

    intro.elapsed += delta;
    const riseProgress = THREE.MathUtils.smoothstep(
        intro.elapsed,
        SHIELD_SHOP_RISE_START,
        SHIELD_SHOP_RISE_START + SHIELD_SHOP_RISE_DURATION
    );
    intro.object.position.y = intro.hoverHeight - intro.riseHeight * (1 - riseProgress);

    camera.up.set(0, 1, 0);
    if (intro.elapsed < intro.cameraReturnStart) {
        const progress = THREE.MathUtils.smoothstep(
            intro.elapsed,
            0,
            SHIELD_SHOP_CAMERA_MOVE_DURATION
        );
        camera.position.lerpVectors(
            intro.cameraStartPosition,
            intro.cameraFocusPosition,
            progress
        );
        camera.lookAt(intro.cameraStartTarget.clone().lerp(intro.focusTarget, progress));
    } else {
        const progress = THREE.MathUtils.smoothstep(
            intro.elapsed,
            intro.cameraReturnStart,
            intro.duration
        );
        camera.position.lerpVectors(
            intro.cameraFocusPosition,
            intro.cameraStartPosition,
            progress
        );
        camera.lookAt(intro.focusTarget.clone().lerp(intro.cameraStartTarget, progress));
    }

    if (intro.elapsed < intro.duration) return;
    intro.object.position.y = intro.hoverHeight;
    shieldShopIntro = null;
    updateCamera();
    startWitherBossLevel();
}

function updateShieldShopHover(delta) {
    if (!shieldShopObject || !isPlaying || isPaused) return;
    shieldShopObject.userData.floatTime += delta;
    shieldShopObject.position.y = shieldShopObject.userData.hoverHeight +
        Math.sin(shieldShopObject.userData.floatTime * SHIELD_SHOP_FLOAT_SPEED) * SHIELD_SHOP_FLOAT_AMPLITUDE;
}

function getNextTurretCost() {
    return TURRET_BASE_COST + turretInstances.length * TURRET_COST_INCREMENT;
}

function findTurretPlacement(index, radius) {
    if (!bombPosition || !mapGroundMesh) return null;
    for (let attempt = 0; attempt < 8; attempt += 1) {
        const angle = index * Math.PI / 2 + attempt * Math.PI / 4;
        const x = bombPosition.x + Math.cos(angle) * TURRET_PLACEMENT_RADIUS;
        const z = bombPosition.z + Math.sin(angle) * TURRET_PLACEMENT_RADIUS;
        const ground = findGroundAt(x, z);
        if (!ground) continue;

        const blocked = staticObstacles.some((obstacle) =>
            Math.hypot(x - obstacle.x, z - obstacle.z) < radius + obstacle.radius
        );
        if (!blocked) return { x, z, height: ground.height };
    }
    return null;
}

function createTurret() {
    if (!turretTemplate) {
        console.error("Cannot purchase a turret because its model is unavailable.");
        showMessage("The turret model is unavailable.");
        return false;
    }

    const model = cloneSkinnedModel(turretTemplate);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    if (!Number.isFinite(size.y) || size.y <= 0) {
        console.error("The turret model has no usable 3D geometry.");
        showMessage("The turret model cannot be placed.");
        return false;
    }

    const scale = 2.2 / size.y;
    const collisionRadius = Math.max(
        TURRET_COLLISION_RADIUS,
        Math.max(size.x, size.z) * scale * 0.45
    );
    const placement = findTurretPlacement(turretInstances.length, collisionRadius);
    if (!placement) {
        console.error("Could not find a clear turret placement beside the bomb.");
        showMessage("There is no clear space beside the bomb for a turret.");
        return false;
    }

    const center = bounds.getCenter(new THREE.Vector3());
    model.scale.multiplyScalar(scale);
    model.position.set(
        -center.x * scale,
        -bounds.min.y * scale,
        -center.z * scale
    );
    const object = new THREE.Group();
    object.position.set(placement.x, placement.height, placement.z);
    object.add(model);
    const mixer = new THREE.AnimationMixer(model);
    const idleClip = turretAnimations.find((animation) => /idle$/i.test(animation.name));
    const idleAction = idleClip ? mixer.clipAction(idleClip) : null;
    const fireActions = turretAnimations
        .filter((animation) => /fire/i.test(animation.name))
        .map((animation) => {
            const action = mixer.clipAction(animation);
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = false;
            return action;
        });
    if (idleAction) idleAction.play();
    if (fireActions.length) {
        mixer.addEventListener("finished", (event) => {
            if (fireActions.includes(event.action) && idleAction) idleAction.reset().play();
        });
    }
    actorMixers.add(mixer);
    scene.add(object);
    turretInstances.push({
        object,
        model,
        modelHeight: size.y * scale,
        modelWidth: size.x * scale,
        modelDepth: size.z * scale,
        fireCooldown: 0,
        collisionRadius,
        upgraded: false,
        mixer,
        idleAction,
        fireActions,
        nextFireAnimationIndex: 0
    });
    addStaticObstacle(
        `turret-${turretInstances.length - 1}`,
        object.position,
        collisionRadius
    );
    return true;
}

function repositionTurrets() {
    removeStaticObstaclesWithPrefix("turret-");
    turretInstances.forEach((turret, index) => {
        const placement = findTurretPlacement(index, turret.collisionRadius);
        if (!placement) {
            console.error(`Could not reposition turret ${index + 1} beside the bomb.`);
            return;
        }
        turret.object.position.set(placement.x, placement.height, placement.z);
        addStaticObstacle(`turret-${index}`, turret.object.position, turret.collisionRadius);
    });
}

function clearTurrets() {
    for (const turret of turretInstances) {
        turret.mixer.stopAllAction();
        actorMixers.delete(turret.mixer);
        scene.remove(turret.object);
    }
    turretInstances.length = 0;
    removeStaticObstaclesWithPrefix("turret-");
}

async function loadFixedRocketModels() {
    try {
        const [rocketGltf, explosionGltf] = await Promise.all([
            new GLTFLoader().loadAsync(NYAN_CAT_MODEL_URL.href),
            new GLTFLoader().loadAsync(ROCKET_EXPLOSION_MODEL_URL.href)
        ]);
        const rocketBounds = new THREE.Box3().setFromObject(rocketGltf.scene);
        const rocketSize = rocketBounds.getSize(new THREE.Vector3());
        if (!Number.isFinite(rocketSize.length()) || rocketSize.length() <= 0) {
            throw new Error("The nyan cat projectile has no usable 3D geometry.");
        }
        const explosionBounds = new THREE.Box3().setFromObject(explosionGltf.scene);
        const explosionSize = explosionBounds.getSize(new THREE.Vector3());
        if (!Number.isFinite(explosionSize.length()) || explosionSize.length() <= 0) {
            throw new Error("The rocket explosion has no usable 3D geometry.");
        }
        prepareModel(rocketGltf.scene);
        prepareModel(explosionGltf.scene);
        rocketTemplate = rocketGltf.scene;
        rocketExplosionTemplate = explosionGltf.scene;
        rocketExplosionAnimations = explosionGltf.animations;
    } catch (error) {
        console.error("Unable to load toaster projectile or explosion assets.", error);
        showMessage("Could not load the toaster rocket effects.");
    }
}

async function loadWeaponModel(weaponId) {
    const cachedModel = weaponTemplates.get(weaponId);
    if (cachedModel) return cachedModel;
    const activeLoad = weaponLoadPromises.get(weaponId);
    if (activeLoad) return activeLoad;

    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === weaponId);
    if (!weapon) throw new Error(`Unknown weapon: ${weaponId}`);

    const loadPromise = new GLTFLoader().loadAsync(weapon.url.href)
        .then((gltf) => {
            const model = gltf.scene;
            const bounds = new THREE.Box3().setFromObject(model);
            const size = bounds.getSize(new THREE.Vector3());
            if (!Number.isFinite(size.length()) || size.length() <= 0) {
                throw new Error(`The ${weapon.name} model has no usable 3D geometry.`);
            }
            prepareModel(model);
            weaponTemplates.set(weaponId, model);
            return model;
        })
        .catch((error) => {
            console.error(`Unable to load ${weapon.name} at ${weapon.url.href}.`, error);
            throw error;
        })
        .finally(() => {
            weaponLoadPromises.delete(weaponId);
        });
    weaponLoadPromises.set(weaponId, loadPromise);
    return loadPromise;
}

async function loadStarterWeapon() {
    try {
        await loadWeaponModel("pistol");
        equipCurrentWeapon();
    } catch (error) {
        showMessage("Could not load the starting pistol.");
    }
}

function prepareModel(model) {
    model.traverse((part) => {
        if (part.isMesh) {
            part.castShadow = true;
            part.receiveShadow = true;
            const materials = Array.isArray(part.material) ? part.material : [part.material];
            for (const material of materials) {
                if (!material) continue;
                for (const value of Object.values(material)) {
                    if (!(value instanceof THREE.Texture)) continue;
                    value.magFilter = THREE.NearestFilter;
                    value.minFilter = THREE.NearestFilter;
                    value.generateMipmaps = false;
                    value.needsUpdate = true;
                }
            }
        }
    });
}

function normalizeActor(model, targetHeight = ACTOR_HEIGHT) {
    const actor = new THREE.Group();
    const bounds = new THREE.Box3().setFromObject(model);
    const height = bounds.getSize(new THREE.Vector3()).y;
    const scale = targetHeight / height;
    model.scale.multiplyScalar(scale);
    model.position.y -= bounds.min.y * scale;
    actor.add(model);
    return actor;
}

function attachAnimation(actor, animations) {
    if (!animations.length) return;
    const mixer = new THREE.AnimationMixer(actor.children[0]);
    mixer.clipAction(animations[0]).play();
    actor.userData.mixer = mixer;
    actorMixers.add(mixer);
}

function attachMonsterAnimations(monster, animations) {
    if (!animations.length) return;
    const mixer = new THREE.AnimationMixer(monster.children[0]);
    const walkClip = animations.find((clip) => /walk|run|move/i.test(clip.name));
    const flyClip = animations.find((clip) => /fly|hover|new/i.test(clip.name));
    const attackClip = animations.find((clip) => /swing.*left|left.*swing/i.test(clip.name))
        ?? animations.find((clip) => /attack|hit|bite|punch|swing/i.test(clip.name));
    const shootClip = animations.find((clip) => /shoot|range_attack|projectile/i.test(clip.name));
    const shootActionClip = shootClip?.clone();
    const inPlaceWalkClip = walkClip?.clone();
    if (inPlaceWalkClip) {
        inPlaceWalkClip.tracks = inPlaceWalkClip.tracks.filter((track) =>
            !(
                track.name.toLowerCase().endsWith(".position") &&
                /(pelvis|hips|root)/i.test(track.name)
            )
        );
    }
    const walkAction = inPlaceWalkClip ? mixer.clipAction(inPlaceWalkClip) : null;
    const flyAction = flyClip ? mixer.clipAction(flyClip) : null;
    const attackAction = attackClip ? mixer.clipAction(attackClip) : null;
    const shootAction = shootActionClip ? mixer.clipAction(shootActionClip) : null;
    if (flyAction) flyAction.play();
    else if (walkAction) walkAction.play();
    if (attackAction) {
        attackAction.setLoop(THREE.LoopOnce, 1);
        attackAction.clampWhenFinished = true;
    }
    if (shootAction) {
        shootAction.setLoop(THREE.LoopOnce, 1);
        shootAction.clampWhenFinished = true;
    }
    monster.userData.mixer = mixer;
    monster.userData.walkAction = walkAction;
    monster.userData.flyAction = flyAction;
    monster.userData.attackAction = attackAction;
    monster.userData.shootAction = shootAction;
    monster.userData.currentAction = flyAction ?? walkAction;
    actorMixers.add(mixer);
}

function setMonsterAnimation(monster, nextAction) {
    const currentAction = monster.userData.currentAction;
    if (currentAction === nextAction) {
        if (nextAction && !nextAction.isRunning()) nextAction.reset().play();
        return;
    }
    if (nextAction) {
        nextAction.reset().play();
        if (currentAction) nextAction.crossFadeFrom(currentAction, 0.15, true);
    } else if (currentAction) {
        currentAction.fadeOut(0.15);
    }
    monster.userData.currentAction = nextAction;
}

function clearWorld() {
    clearBombExplosionWave();
    for (const child of worldRoot.children) {
        child.traverse((part) => {
            if (!part.isMesh) return;
            part.geometry?.dispose();
            const materials = Array.isArray(part.material) ? part.material : [part.material];
            for (const material of materials) material?.dispose();
        });
    }
    worldRoot.clear();
    clearAmmoDrops();
    clearRareDrops();
    staticObstacles.length = 0;
    mapColliders = [];
    mapGroundMesh = null;
}

function resetPlayerPosition() {
    const spawn = findTerrainSpawn(PLAYER_SPAWN_OFFSET_X, 0);
    playerGroundHeight = spawn?.height ?? 0;
    playerPosition.set(spawn?.x ?? PLAYER_SPAWN_OFFSET_X, playerGroundHeight, spawn?.z ?? 0);
    playerVerticalVelocity = 0;
    isPlayerGrounded = true;
    if (!spawn) showMessage("No walkable terrain found; spawning at the map origin.");
    if (playerObject) {
        playerObject.position.copy(playerPosition);
        playerObject.rotation.y = playerYaw;
    }
}

function placeBomb() {
    if (!bombObject || !bombTemplate || !mapGroundMesh) return;
    removeStaticObstacle("bomb");
    const placement = findTerrainSpawn(playerPosition.x + 4, playerPosition.z + 2);
    if (!placement) {
        console.error("Could not find walkable terrain for the bomb.");
        return;
    }

    const model = cloneSkinnedModel(bombTemplate);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const targetHeight = 2.2;
    const scale = targetHeight / size.y;
    model.scale.multiplyScalar(scale);
    model.position.set(
        -((bounds.min.x + bounds.max.x) / 2) * scale,
        -bounds.min.y * scale,
        -((bounds.min.z + bounds.max.z) / 2) * scale
    );
    bombObject.clear();
    bombShieldObject = null;
    bombObject.add(model);
    bombObject.position.set(placement.x, placement.height, placement.z);
    bombPosition.set(placement.x, placement.height, placement.z);
    bombObject.visible = bombHealth > 0;
    if (bombShieldPurchased && bombShieldHealth > 0) attachBombShield();
    addStaticObstacle(
        "bomb",
        bombPosition,
        Math.max(size.x, size.z) * scale * 0.45
    );
    if (turretInstances.length) repositionTurrets();
}

function attachBombShield() {
    if (!bombObject || !bombShieldTemplate) {
        console.error("Cannot attach the bomb shield because its model is unavailable.");
        return false;
    }

    const shield = cloneSkinnedModel(bombShieldTemplate);
    shield.traverse((part) => {
        if (!part.isMesh) return;
        const sourceMaterials = Array.isArray(part.material) ? part.material : [part.material];
        const glassMaterials = sourceMaterials.map((sourceMaterial) => {
            const material = sourceMaterial.clone();
            if (material.color) material.color.set(0x5aaeff);
            if (material.emissive) {
                material.emissive.set(0x123b70);
                material.emissiveIntensity = 0.2;
            }
            if ("roughness" in material) material.roughness = 0.14;
            if ("metalness" in material) material.metalness = 0.12;
            material.transparent = true;
            material.opacity = 0.3;
            material.depthWrite = false;
            material.side = THREE.DoubleSide;
            material.needsUpdate = true;
            return material;
        });
        part.material = Array.isArray(part.material) ? glassMaterials : glassMaterials[0];
    });
    const bounds = new THREE.Box3().setFromObject(shield);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error("The bomb shield model has no usable 3D geometry.");
        return false;
    }

    const scale = 3.96 / longestSide;
    const center = bounds.getCenter(new THREE.Vector3());
    shield.scale.multiplyScalar(scale);
    shield.position.set(
        -center.x * scale,
        -bounds.min.y * scale - 1,
        -center.z * scale
    );
    bombObject.add(shield);
    bombShieldObject = shield;
    return true;
}

function removeBombShield() {
    if (bombShieldObject) bombObject.remove(bombShieldObject);
    bombShieldObject = null;
}

function addStaticObstacle(id, position, radius) {
    removeStaticObstacle(id);
    if (!Number.isFinite(radius) || radius <= 0) {
        console.error(`Cannot create a collision boundary for ${id}: invalid size.`);
        return;
    }
    staticObstacles.push({ id, x: position.x, z: position.z, radius });
}

function removeStaticObstacle(id) {
    const index = staticObstacles.findIndex((obstacle) => obstacle.id === id);
    if (index >= 0) staticObstacles.splice(index, 1);
}

function removeStaticObstaclesWithPrefix(prefix) {
    for (let index = staticObstacles.length - 1; index >= 0; index -= 1) {
        if (staticObstacles[index].id.startsWith(prefix)) staticObstacles.splice(index, 1);
    }
}

function findGroundAt(x, z) {
    if (!mapGroundMesh) return null;
    groundRaycaster.set(
        new THREE.Vector3(x, terrainRayTop, z),
        new THREE.Vector3(0, -1, 0)
    );
    groundRaycaster.near = 0;
    groundRaycaster.far = terrainRayTop - terrainRayBottom;
    const intersections = groundRaycaster.intersectObject(mapGroundMesh, false);
    for (const intersection of intersections) {
        if (!intersection.face) continue;
        const normal = intersection.face.normal
            .clone()
            .applyMatrix3(groundNormalMatrix.getNormalMatrix(intersection.object.matrixWorld))
            .normalize();
        if (normal.y >= 0.55) {
            return { height: intersection.point.y, normalY: normal.y };
        }
    }
    return null;
}

function findTerrainSpawn(preferredX, preferredZ) {
    const directGround = findGroundAt(preferredX, preferredZ);
    if (directGround) return { x: preferredX, z: preferredZ, ...directGround };

    let bestSpawn = null;
    let bestDistance = Infinity;
    const step = Math.max(1.25, Math.max(worldBounds.halfWidth, worldBounds.halfDepth) / 20);
    for (let x = -worldBounds.halfWidth + 1; x <= worldBounds.halfWidth - 1; x += step) {
        for (let z = -worldBounds.halfDepth + 1; z <= worldBounds.halfDepth - 1; z += step) {
            const ground = findGroundAt(x, z);
            if (!ground) continue;
            const distance = (x - preferredX) ** 2 + (z - preferredZ) ** 2;
            if (distance < bestDistance) {
                bestDistance = distance;
                bestSpawn = { x, z, ...ground };
            }
        }
    }
    return bestSpawn;
}

async function loadFixedTreeModel() {
    treeFileStatus.textContent = "Loading models/tree.glb...";
    try {
        const gltf = await new GLTFLoader().loadAsync(TREE_MODEL_URL.href);
        treeTemplate = gltf.scene;
        prepareModel(treeTemplate);
        populateTrees();
        treeFileStatus.textContent = `Loaded models/tree.glb (${treeInstancesRoot.children.length} trees placed)`;
    } catch (error) {
        console.error(`Unable to load the fixed tree model at ${TREE_MODEL_URL.href}.`, error);
        treeFileStatus.textContent = "Could not load models/tree.glb.";
    }
}

async function loadFixedMysteryBoxModel() {
    try {
        const gltf = await new GLTFLoader().loadAsync(MYSTERY_BOX_MODEL_URL.href);
        mysteryBoxTemplate = gltf.scene;
        mysteryBoxAnimations = gltf.animations;
        prepareModel(mysteryBoxTemplate);
        placeMysteryBox();
        populateTrees();
    } catch (error) {
        console.error(`Unable to load the mystery box at ${MYSTERY_BOX_MODEL_URL.href}.`, error);
        showMessage("Could not load models/MBox.glb.");
    }
}

function placeMysteryBox() {
    clearMysteryBox();
    if (!mysteryBoxTemplate || !mapGroundMesh) return;

    const candidates = [
        [playerPosition.x + 9, playerPosition.z],
        [playerPosition.x - 9, playerPosition.z],
        [playerPosition.x, playerPosition.z + 9],
        [playerPosition.x, playerPosition.z - 9]
    ];
    let placement = null;
    for (const [x, z] of candidates) {
        const ground = findGroundAt(x, z);
        if (ground?.normalY >= 0.75) {
            placement = { x, z, height: ground.height };
            break;
        }
    }
    if (!placement) {
        placement = findTerrainSpawn(playerPosition.x + 9, playerPosition.z);
    }
    if (!placement) {
        console.error("Could not find walkable terrain for the mystery box.");
        return;
    }

    const model = cloneSkinnedModel(mysteryBoxTemplate);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const horizontalSize = Math.max(size.x, size.z);
    if (!Number.isFinite(horizontalSize) || horizontalSize <= 0) {
        console.error("The mystery-box model has no usable geometry.");
        return;
    }
    const scale = MYSTERY_BOX_TARGET_WIDTH / horizontalSize;
    mysteryBoxPreviewHeight = size.y * scale + 0.35;
    model.scale.multiplyScalar(scale);
    model.position.set(
        -((bounds.min.x + bounds.max.x) / 2) * scale,
        -bounds.min.y * scale,
        -((bounds.min.z + bounds.max.z) / 2) * scale
    );
    mysteryBoxObject.clear();
    mysteryBoxObject.add(model);
    if (mysteryBoxAnimations.length) {
        mysteryBoxMixer = new THREE.AnimationMixer(model);
        const openAnimation = mysteryBoxAnimations.find((clip) => /open/i.test(clip.name))
            ?? mysteryBoxAnimations[0];
        mysteryBoxOpenAction = mysteryBoxMixer.clipAction(openAnimation);
        mysteryBoxOpenAction.setLoop(THREE.LoopOnce, 1);
        mysteryBoxOpenAction.clampWhenFinished = true;
        mysteryBoxMixer.addEventListener("finished", onMysteryBoxAnimationFinished);
        actorMixers.add(mysteryBoxMixer);
    }
    mysteryBoxObject.position.set(placement.x, placement.height, placement.z);
    mysteryBoxObject.visible = true;
    mysteryBoxPosition = new THREE.Vector3(placement.x, placement.height, placement.z);
    addStaticObstacle("mystery-box", mysteryBoxPosition, horizontalSize * scale * 0.48);
}

function clearMysteryBox() {
    removeStaticObstacle("mystery-box");
    if (mysteryBoxMixer) {
        mysteryBoxMixer.stopAllAction();
        mysteryBoxMixer.removeEventListener("finished", onMysteryBoxAnimationFinished);
        actorMixers.delete(mysteryBoxMixer);
    }
    mysteryBoxMixer = null;
    mysteryBoxOpenAction = null;
    isMysteryBoxOpening = false;
    mysteryBoxIsHeldOpen = false;
    mysteryBoxIsClosing = false;
    mysteryBoxRewardRevealed = false;
    pendingMysteryBoxWeaponId = null;
    clearMysteryBoxPreview();
    if (mysteryBoxObject) {
        mysteryBoxObject.clear();
        mysteryBoxObject.visible = false;
    }
    mysteryBoxPosition = null;
    if (mysteryBoxPrompt) mysteryBoxPrompt.hidden = true;
}

function isNearMysteryBox() {
    return mysteryBoxPosition !== null &&
        playerPosition.distanceTo(mysteryBoxPosition) <= MYSTERY_BOX_INTERACTION_DISTANCE;
}

function findNearbyShop() {
    let nearbyShop = null;
    let nearestDistance = Infinity;
    for (const shop of shopPlacements) {
        const distance = Math.hypot(
            playerPosition.x - shop.position.x,
            playerPosition.z - shop.position.z
        );
        if (distance <= shop.interactionDistance && distance < nearestDistance) {
            nearbyShop = shop;
            nearestDistance = distance;
        }
    }
    return nearbyShop;
}

function findNearbyTurret() {
    let nearbyTurret = null;
    let nearestDistance = Infinity;
    for (const turret of turretInstances) {
        const distance = Math.hypot(
            playerPosition.x - turret.object.position.x,
            playerPosition.z - turret.object.position.z
        );
        if (
            distance <= turret.collisionRadius + TURRET_INTERACTION_MARGIN &&
            distance < nearestDistance
        ) {
            nearbyTurret = turret;
            nearestDistance = distance;
        }
    }
    if (nearbyTurret && isNearBombShieldPurchase()) {
        const shieldShop = shopPlacements.find((shop) => shop.type === "shield");
        const shieldPosition = shieldShop?.position ?? bombPosition;
        const shieldDistance = Math.hypot(
            playerPosition.x - shieldPosition.x,
            playerPosition.z - shieldPosition.z
        );
        if (shieldDistance < nearestDistance) return null;
    }
    return nearbyTurret;
}

function isNearBombShieldPurchase() {
    const shop = shopPlacements.find((placement) => placement.type === "shield");
    const position = shop?.position ?? bombPosition;
    const interactionDistance = shop?.interactionDistance ?? SHOP_INTERACTION_DISTANCE;
    return level === LEVEL_COUNT &&
        position !== null &&
        Math.hypot(
            playerPosition.x - position.x,
            playerPosition.z - position.z
        ) <= interactionDistance;
}

function isNearCraftingTable() {
    return craftingTablePosition !== null &&
        Math.hypot(
            playerPosition.x - craftingTablePosition.x,
            playerPosition.z - craftingTablePosition.z
        ) <= CRAFTING_STATION_INTERACTION_DISTANCE;
}

function updateCraftingStation() {
    const hasToaster = ownedWeaponIds.has("toaster");
    const recipeAmount = hasToaster ? TOASTER_AMMO_RECIPE_AMOUNT : TOASTER_RECIPE_AMOUNT;
    craftSmallbombCount.textContent = `${rareDropCounts.smallbomb} / ${recipeAmount}`;
    craftRainbowCount.textContent = `${rareDropCounts.rainbow} / ${recipeAmount}`;
    craftInstructions.textContent = hasToaster
        ? `Press E to craft ${TOASTER_AMMO_CRAFT_AMOUNT} Toaster reserve ammo with ${TOASTER_AMMO_RECIPE_AMOUNT} Small Bomb and ${TOASTER_AMMO_RECIPE_AMOUNT} Rainbow.`
        : `Press E to craft the Toaster with ${TOASTER_RECIPE_AMOUNT} Small Bombs and ${TOASTER_RECIPE_AMOUNT} Rainbows.`;
}

function tryPurchaseBombShield() {
    if (!isNearBombShieldPurchase()) return false;
    if (bombShieldPurchased) {
        showMessage("The bomb already has a shield.");
        return true;
    }
    if (bombHealth <= 0 || !bombObject?.visible) {
        showMessage("The bomb cannot be shielded right now.");
        return true;
    }
    if (!bombShieldTemplate) {
        console.error("Cannot purchase a bomb shield because its model is unavailable.");
        showMessage("The bomb shield is unavailable.");
        return true;
    }
    if (dabloons < BOMB_SHIELD_COST) {
        showMessage(`The bomb shield costs ${BOMB_SHIELD_COST} Dabloons.`);
        return true;
    }

    if (!attachBombShield()) {
        showMessage("The bomb shield could not be activated.");
        return true;
    }

    dabloons -= BOMB_SHIELD_COST;
    bombShieldHealth = BOMB_SHIELD_MAX_HEALTH;
    bombShieldPurchased = true;
    updateHud();
    showMessage(`Bomb shield activated with ${BOMB_SHIELD_MAX_HEALTH} health.`);
    return true;
}

function attachTurretCrown(turret) {
    if (!turretCrownTemplate) return false;

    const crown = cloneSkinnedModel(turretCrownTemplate);
    const crownBounds = new THREE.Box3().setFromObject(crown);
    const crownSize = crownBounds.getSize(new THREE.Vector3());
    const crownWidth = Math.max(crownSize.x, crownSize.z);
    const targetWidth = Math.min(turret.modelWidth, turret.modelDepth) * TURRET_CROWN_WIDTH_RATIO;
    if (
        !Number.isFinite(crownWidth) || crownWidth <= 0 ||
        !Number.isFinite(targetWidth) || targetWidth <= 0
    ) {
        console.error("The turret crown could not be fitted to the turret model.");
        return false;
    }

    const scale = targetWidth / crownWidth;
    const center = crownBounds.getCenter(new THREE.Vector3());
    crown.scale.multiplyScalar(scale);
    crown.position.set(
        -center.x * scale,
        turret.modelHeight * TURRET_CROWN_BASE_HEIGHT_RATIO - crownBounds.min.y * scale,
        turret.modelHeight * TURRET_CROWN_FORWARD_OFFSET_RATIO - center.z * scale
    );
    turret.object.add(crown);
    return true;
}

function tryUpgradeNearbyTurret() {
    const turret = findNearbyTurret();
    if (!turret) return false;
    if (turret.upgraded) {
        showMessage("This turret is already upgraded.");
        return true;
    }
    if (dabloons < TURRET_UPGRADE_COST) {
        showMessage(`A turret upgrade costs ${TURRET_UPGRADE_COST} Dabloons.`);
        return true;
    }
    if (!attachTurretCrown(turret)) {
        showMessage("The turret crown could not be attached.");
        return true;
    }

    turret.upgraded = true;
    dabloons -= TURRET_UPGRADE_COST;
    updateHud();
    showMessage("Turret upgraded with a crown.");
    return true;
}

async function tryCraftToaster() {
    if (!isNearCraftingTable()) return false;
    if (isCraftingToaster) return true;

    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === "toaster");
    if (!weapon) {
        console.error("The Toaster weapon definition is missing.");
        return true;
    }

    if (ownedWeaponIds.has("toaster")) {
        const ammo = getWeaponAmmo(weapon);
        if (
            rareDropCounts.smallbomb < TOASTER_AMMO_RECIPE_AMOUNT ||
            rareDropCounts.rainbow < TOASTER_AMMO_RECIPE_AMOUNT
        ) {
            showMessage("Need 1 Small Bomb and 1 Rainbow to craft Toaster ammo.");
            return true;
        }

        rareDropCounts.smallbomb -= TOASTER_AMMO_RECIPE_AMOUNT;
        rareDropCounts.rainbow -= TOASTER_AMMO_RECIPE_AMOUNT;
        ammo.reserve += TOASTER_AMMO_CRAFT_AMOUNT;
        updateHud();
        showMessage(`Crafted ${TOASTER_AMMO_CRAFT_AMOUNT} Toaster reserve ammo.`);
        return true;
    }

    if (
        rareDropCounts.smallbomb < TOASTER_RECIPE_AMOUNT ||
        rareDropCounts.rainbow < TOASTER_RECIPE_AMOUNT
    ) {
        updateCraftingStation();
        return true;
    }

    isCraftingToaster = true;
    updateCraftingStation();
    try {
        await loadWeaponModel(weapon.id);
        if (ownedWeaponIds.has(weapon.id)) return true;

        rareDropCounts.smallbomb -= TOASTER_RECIPE_AMOUNT;
        rareDropCounts.rainbow -= TOASTER_RECIPE_AMOUNT;
        unlockWeapon(weapon);
        currentWeaponId = weapon.id;
        equipCurrentWeapon();
        updateWeaponQuickSelect();
        updateHud();
        return true;
    } catch (error) {
        console.error("Unable to craft the Toaster.", error);
        return true;
    } finally {
        isCraftingToaster = false;
        updateCraftingStation();
    }
}

function tryPurchaseFromShop() {
    const shop = findNearbyShop();
    if (!shop) return false;

    if (shop.type === "magnet") {
        if (magnetPurchased) {
            showMessage("You already own the magnet.");
            return true;
        }
        if (dabloons < MAGNET_COST) {
            showMessage(`The magnet costs ${MAGNET_COST} Dabloons.`);
            return true;
        }

        magnetPurchased = true;
        dabloons -= MAGNET_COST;
        updateHud();
        showMessage("Magnet purchased! Nearby mob drops will be attracted to you.");
        return true;
    }

    if (shop.type === "turret") {
        if (turretInstances.length >= TURRET_MAX_COUNT) {
            showMessage(`You can only have ${TURRET_MAX_COUNT} turrets.`);
            return true;
        }
        const cost = getNextTurretCost();
        if (dabloons < cost) {
            showMessage(`The next turret costs ${cost} Dabloons.`);
            return true;
        }
        if (!createTurret()) return true;

        dabloons -= cost;
        updateHud();
        showMessage(`Turret purchased for ${cost} Dabloons.`);
        return true;
    }

    if (shop.type === "healing") {
        if (health >= PLAYER_MAX_HEALTH) {
            showMessage("Your health is already full.");
            return true;
        }
        if (dabloons < HEALING_SHOP_COST) {
            showMessage(`Healing costs ${HEALING_SHOP_COST} Dabloons.`);
            return true;
        }

        const restoredHealth = Math.min(HEALING_SHOP_HEALTH, PLAYER_MAX_HEALTH - health);
        dabloons -= HEALING_SHOP_COST;
        health += restoredHealth;
        updateHud();
        showMessage(`Healed ${restoredHealth} health.`);
        return true;
    }

    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === currentWeaponId);
    if (!weapon) {
        showMessage("No weapon is equipped.");
        return true;
    }
    if (weapon.id === "toaster") {
        showMessage("Toaster ammo must be crafted at the crafting table.");
        return true;
    }
    const ammo = getWeaponAmmo(weapon);
    if (dabloons < AMMO_SHOP_COST) {
        showMessage(`Ammo costs ${AMMO_SHOP_COST} Dabloons.`);
        return true;
    }

    const reserveAmmoAdded = weapon.magazineSize;
    dabloons -= AMMO_SHOP_COST;
    ammo.reserve += reserveAmmoAdded;
    updateHud();
    showMessage(`Added ${reserveAmmoAdded} ${weapon.name} reserve ammo.`);
    return true;
}

function unlockWeapon(weapon) {
    const wasOwned = ownedWeaponIds.has(weapon.id);
    ownedWeaponIds.add(weapon.id);
    const ammo = getWeaponAmmo(weapon);
    if (!wasOwned) {
        if (ammo.magazine === 0) ammo.magazine = weapon.magazineSize;
        ammo.reserve += weapon.startingReserve;
    }
    cacheWeaponThumbnail(weapon);
    updateWeaponQuickSelect();
}

function tryOpenMysteryBox() {
    if (!isNearMysteryBox()) return;
    if (isMysteryBoxOpening) return;
    if (dabloons < MYSTERY_BOX_COST) {
        showMessage(`The mystery box costs ${MYSTERY_BOX_COST} Dabloons.`);
        return;
    }
    if (!mysteryBoxOpenAction) {
        showMessage("The mystery box model has no opening animation.");
        return;
    }
    isMysteryBoxOpening = true;
    const rewards = MYSTERY_BOX_REWARDS;
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    pendingMysteryBoxWeaponId = reward.id;
    mysteryBoxRouletteElapsed = 0;
    mysteryBoxRouletteIndex = 0;
    mysteryBoxHoldElapsed = 0;
    mysteryBoxIsHeldOpen = false;
    mysteryBoxIsClosing = false;
    mysteryBoxRewardRevealed = false;
    showMessage("The mystery box is getting ready...");
    preloadMysteryBoxWeapons().then((results) => {
        if (!isMysteryBoxOpening) return;
        const failedLoad = results.find((result) => result.status === "rejected");
        if (failedLoad) {
            pendingMysteryBoxWeaponId = null;
            isMysteryBoxOpening = false;
            weaponRewardLoadPromise = null;
            showMessage("A weapon model could not load. Your Dabloons were not spent.");
            return;
        }
        if (dabloons < MYSTERY_BOX_COST) {
            pendingMysteryBoxWeaponId = null;
            isMysteryBoxOpening = false;
            showMessage(`The mystery box costs ${MYSTERY_BOX_COST} Dabloons.`);
            return;
        }
        dabloons -= MYSTERY_BOX_COST;
        updateHud();
        showMysteryBoxWeaponPreview(rewards[mysteryBoxRouletteIndex].id);
        mysteryBoxOpenAction.reset();
        mysteryBoxOpenAction.time = MYSTERY_BOX_ANIMATION_START_OFFSET;
        mysteryBoxOpenAction.play();
        showMessage("The mystery box is opening...");
    });
}

function preloadMysteryBoxWeapons() {
    if (!weaponRewardLoadPromise) {
        weaponRewardLoadPromise = Promise.allSettled(
            MYSTERY_BOX_REWARDS.map((weapon) => loadWeaponModel(weapon.id))
        );
    }
    return weaponRewardLoadPromise;
}

function onMysteryBoxAnimationFinished(event) {
    if (event.action === mysteryBoxOpenAction) {
        if (mysteryBoxIsClosing) {
            isMysteryBoxOpening = false;
            mysteryBoxIsClosing = false;
            clearMysteryBoxPreview();
            return;
        }
        const reward = WEAPON_DEFINITIONS.find((weapon) => weapon.id === pendingMysteryBoxWeaponId);
        if (reward) showMysteryBoxWeaponPreview(reward.id);
        mysteryBoxOpenAction.paused = true;
        mysteryBoxIsHeldOpen = true;
    }
}

function updateMysteryBoxRoulette(delta) {
    if (!isMysteryBoxOpening || mysteryBoxIsClosing) return;
    if (!mysteryBoxIsHeldOpen && mysteryBoxOpenAction?.isRunning() &&
        mysteryBoxOpenAction.time >= 5.2) {
        mysteryBoxOpenAction.paused = true;
        mysteryBoxIsHeldOpen = true;
    }
    if (!mysteryBoxIsHeldOpen) return;
    mysteryBoxPreviewRotation = (mysteryBoxPreviewRotation + delta * 4) % (Math.PI * 2);
    if (mysteryBoxPreview) {
        const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === mysteryBoxPreview.userData.weaponId);
        mysteryBoxPreview.rotation.y = (weapon?.rotation[1] ?? 0) + mysteryBoxPreviewRotation;
    }
    mysteryBoxHoldElapsed += delta;
    if (!mysteryBoxRewardRevealed && mysteryBoxHoldElapsed >= 2.5) {
        mysteryBoxRewardRevealed = true;
        const reward = WEAPON_DEFINITIONS.find((weapon) => weapon.id === pendingMysteryBoxWeaponId);
        if (reward) showMysteryBoxWeaponPreview(reward.id);
        completeMysteryBoxReward();
    }
    if (mysteryBoxRewardRevealed && mysteryBoxHoldElapsed >= 3.6) {
        startMysteryBoxClosing();
        return;
    }
    mysteryBoxRouletteElapsed += delta;
    if (mysteryBoxRouletteElapsed < 0.16) return;
    mysteryBoxRouletteElapsed = 0;
    const rewards = MYSTERY_BOX_REWARDS;
    mysteryBoxRouletteIndex = (mysteryBoxRouletteIndex + 1) % rewards.length;
    showMysteryBoxWeaponPreview(rewards[mysteryBoxRouletteIndex].id);
}

function startMysteryBoxClosing() {
    if (!mysteryBoxOpenAction || mysteryBoxIsClosing) return;
    mysteryBoxIsHeldOpen = false;
    mysteryBoxIsClosing = true;
    mysteryBoxOpenAction.paused = false;
    mysteryBoxOpenAction.time = Math.max(14.8, mysteryBoxOpenAction.getClip().duration - 1.2);
    mysteryBoxOpenAction.play();
}

function showMysteryBoxWeaponPreview(weaponId) {
    const template = weaponTemplates.get(weaponId);
    if (!template || !mysteryBoxObject) return;
    clearMysteryBoxPreview();

    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === weaponId);
    const model = cloneSkinnedModel(template);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error(`The ${weapon.name} preview has no usable 3D geometry.`);
        return;
    }

    const preview = new THREE.Group();
    model.scale.multiplyScalar(0.65 / longestSide);
    model.position.set(
        -((bounds.min.x + bounds.max.x) / 2) * (0.65 / longestSide),
        -((bounds.min.y + bounds.max.y) / 2) * (0.65 / longestSide),
        -((bounds.min.z + bounds.max.z) / 2) * (0.65 / longestSide)
    );
    preview.add(model);
    preview.position.set(0, mysteryBoxPreviewHeight, 0);
    preview.rotation.set(...weapon.rotation);
    preview.userData.weaponId = weaponId;
    preview.name = "mystery-box-weapon-preview";
    preview.rotation.y += mysteryBoxPreviewRotation;
    mysteryBoxObject.add(preview);
    mysteryBoxPreview = preview;
}

function clearMysteryBoxPreview() {
    if (mysteryBoxPreview?.parent) mysteryBoxPreview.parent.remove(mysteryBoxPreview);
    mysteryBoxPreview = null;
}

async function completeMysteryBoxReward() {
    const weaponId = pendingMysteryBoxWeaponId;
    pendingMysteryBoxWeaponId = null;
    if (!weaponId) {
        return;
    }

    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === weaponId);
    if (ownedWeaponIds.has(weaponId)) {
        showMessage(`You already own the ${weapon.name}. No new weapon this time.`);
        return;
    }

    try {
        await loadWeaponModel(weaponId);
        unlockWeapon(weapon);
        currentWeaponId = weaponId;
        equipCurrentWeapon();
        updateWeaponQuickSelect();
        updateHud();
        showMessage(`You unlocked the ${weapon.name}!`);
    } catch (error) {
        showMessage(`The ${weapon.name} could not be loaded.`);
    }
}

function populateTrees() {
    clearTreeInstances();
    if (!treeTemplate || !mapGroundMesh) return;

    const targetCount = Math.min(
        TREE_MAX_COUNT,
        Math.max(12, Math.round((worldBounds.halfWidth * worldBounds.halfDepth * 4) / 260))
    );
    const positions = [];
    const minX = -worldBounds.halfWidth + 2;
    const maxX = worldBounds.halfWidth - 2;
    const minZ = -worldBounds.halfDepth + 2;
    const maxZ = worldBounds.halfDepth - 2;
    const maxAttempts = targetCount * 60;

    for (let attempt = 0; attempt < maxAttempts && positions.length < targetCount; attempt += 1) {
        const x = THREE.MathUtils.randFloat(minX, maxX);
        const z = THREE.MathUtils.randFloat(minZ, maxZ);
        if (Math.hypot(x - playerPosition.x, z - playerPosition.z) < TREE_SPAWN_CLEARANCE) continue;
        if (mysteryBoxPosition && Math.hypot(x - mysteryBoxPosition.x, z - mysteryBoxPosition.z) < TREE_SPAWN_CLEARANCE) continue;
        if (positions.some((position) => Math.hypot(x - position.x, z - position.z) < TREE_SPACING)) continue;
        const ground = findGroundAt(x, z);
        if (!ground || ground.normalY < 0.75) continue;
        positions.push({ x, z, height: ground.height });
    }

    for (const position of positions) {
        const tree = normalizeTree(cloneSkinnedModel(treeTemplate));
        tree.position.set(position.x, position.height, position.z);
        tree.rotation.y = THREE.MathUtils.randFloat(0, Math.PI * 2);
        const size = THREE.MathUtils.randFloat(0.8, 1.2);
        tree.scale.setScalar(size);
        treeInstancesRoot.add(tree);
    }
    treeFileStatus.textContent = `Loaded models/tree.glb (${positions.length} trees placed)`;
}

function clearTreeInstances() {
    if (treeInstancesRoot) treeInstancesRoot.clear();
}

function normalizeTree(model) {
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    if (!Number.isFinite(size.y) || size.y <= 0) {
        throw new Error("The tree file has no usable 3D geometry.");
    }

    const scale = TREE_TARGET_HEIGHT / size.y;
    const tree = new THREE.Group();
    model.scale.multiplyScalar(scale);
    model.position.y -= bounds.min.y * scale;
    tree.add(model);
    return tree;
}

function replacePlayerModel() {
    if (playerObject) {
        scene.remove(playerObject);
        if (playerObject.userData.mixer) actorMixers.delete(playerObject.userData.mixer);
    }
    equippedWeaponObject = null;
    playerObject = playerTemplate
        ? normalizeActor(cloneSkinnedModel(playerTemplate), ACTOR_HEIGHT * PLAYER_MODEL_SCALE)
        : createPlaceholderPlayer();
    attachAnimation(playerObject, playerAnimations);
    playerObject.position.copy(playerPosition);
    playerObject.rotation.y = playerYaw;
    scene.add(playerObject);
    equipCurrentWeapon();
}

function equipCurrentWeapon() {
    if (!playerObject) return;
    if (equippedWeaponObject) playerObject.remove(equippedWeaponObject);
    equippedWeaponObject = null;
    updateWeaponPreview();
    const template = weaponTemplates.get(currentWeaponId);
    if (!template) return;

    const model = cloneSkinnedModel(template);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error(`The ${currentWeaponId} model has no usable 3D geometry.`);
        return;
    }

    const weaponDefinition = WEAPON_DEFINITIONS.find((weapon) => weapon.id === currentWeaponId);
    const weaponGroup = new THREE.Group();
    const modelScale = (weaponDefinition?.equippedSize ?? 0.75) / longestSide;
    model.scale.multiplyScalar(modelScale);
    model.position.set(
        -((bounds.min.x + bounds.max.x) / 2) * modelScale,
        -((bounds.min.y + bounds.max.y) / 2) * modelScale,
        -((bounds.min.z + bounds.max.z) / 2) * modelScale
    );
    weaponGroup.add(model);
    const weaponPosition = weaponDefinition?.position ?? [0.5, 1.1, 0.72];
    weaponGroup.position.set(
        weaponPosition[0] * PLAYER_MODEL_SCALE,
        weaponPosition[1] * PLAYER_MODEL_SCALE,
        weaponPosition[2] * PLAYER_MODEL_SCALE
    );
    weaponGroup.scale.setScalar(PLAYER_MODEL_SCALE);
    weaponGroup.rotation.set(...(weaponDefinition?.rotation ?? [0, 0, 0]));
    weaponGroup.name = "equipped-weapon";
    playerObject.add(weaponGroup);
    equippedWeaponObject = weaponGroup;
}

function updateWeaponPreview() {
    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === currentWeaponId);
    weaponPreviewName.textContent = weapon?.name ?? "No weapon";
    if (!weaponPreviewRenderer || !weaponPreviewScene || !weapon) return;
    if (weaponPreviewObject) {
        weaponPreviewScene.remove(weaponPreviewObject);
        weaponPreviewObject = null;
    }
    const template = weaponTemplates.get(currentWeaponId);
    if (!template) {
        weaponPreviewRenderer.clear();
        return;
    }

    const model = cloneSkinnedModel(template);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error(`The ${weapon.name} preview has no usable 3D geometry.`);
        return;
    }
    const scale = 1.5 / longestSide;
    model.scale.multiplyScalar(scale);
    model.position.multiplyScalar(scale);
    model.position.sub(bounds.getCenter(new THREE.Vector3()).multiplyScalar(scale));
    weaponPreviewObject = model;
    weaponPreviewObject.rotation.set(...weapon.rotation);
    weaponPreviewScene.add(weaponPreviewObject);
    weaponPreviewRenderer.render(weaponPreviewScene, weaponPreviewCamera);
}

function cacheWeaponThumbnail(weapon) {
    if (weaponThumbnailUrls.has(weapon.id)) return;
    const template = weaponTemplates.get(weapon.id);
    if (!template || !weaponPreviewRenderer || !weaponPreviewScene || !weaponPreviewCamera) return;

    const imageUrl = createModelThumbnail(template, weapon.rotation, weapon.name);
    if (imageUrl) weaponThumbnailUrls.set(weapon.id, imageUrl);
}

function cacheRareDropThumbnail(dropType) {
    const template = rareDropTemplates.get(dropType);
    if (!template || !weaponPreviewRenderer || !weaponPreviewScene || !weaponPreviewCamera) return;
    const imageUrl = createModelThumbnail(template, [0, Math.PI / 4, 0], `${dropType} collectible`);
    if (!imageUrl) return;

    const image = dropType === "smallbomb" ? smallbombCounterImage : rainbowCounterImage;
    image.src = imageUrl;
    const craftingImage = dropType === "smallbomb" ? craftSmallbombImage : craftRainbowImage;
    craftingImage.src = imageUrl;
}

function createModelThumbnail(template, rotation, label) {
    const model = cloneSkinnedModel(template);
    model.rotation.set(...rotation);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error(`The ${label} image has no usable 3D geometry.`);
        return null;
    }

    const scale = 1.5 / longestSide;
    model.scale.multiplyScalar(scale);
    model.position.multiplyScalar(scale);
    model.position.sub(bounds.getCenter(new THREE.Vector3()).multiplyScalar(scale));

    const previousObject = weaponPreviewObject;
    if (previousObject) weaponPreviewScene.remove(previousObject);
    weaponPreviewScene.add(model);
    try {
        weaponPreviewRenderer.render(weaponPreviewScene, weaponPreviewCamera);
        return weaponPreviewRenderer.domElement.toDataURL("image/png");
    } catch (error) {
        console.error(`Unable to create the ${label} image.`, error);
        return null;
    } finally {
        weaponPreviewScene.remove(model);
        if (previousObject) weaponPreviewScene.add(previousObject);
        weaponPreviewRenderer.render(weaponPreviewScene, weaponPreviewCamera);
    }
}

function updateWeaponQuickSelect() {
    weaponQuickSelect.replaceChildren();
    WEAPON_DEFINITIONS.forEach((weapon, index) => {
        if (!ownedWeaponIds.has(weapon.id)) return;
        const slot = document.createElement("div");
        slot.className = "weapon-quick-slot";
        slot.classList.toggle("equipped", weapon.id === currentWeaponId);
        slot.setAttribute("role", "listitem");
        slot.setAttribute("aria-label", `${weapon.name}, press ${index + 1} to equip`);
        slot.title = `${weapon.name} - press ${index + 1}`;

        const imageUrl = weaponThumbnailUrls.get(weapon.id);
        if (imageUrl) {
            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = weapon.name;
            slot.append(image);
        } else {
            const fallback = document.createElement("span");
            fallback.className = "weapon-quick-fallback";
            fallback.textContent = weapon.name;
            slot.append(fallback);
        }

        const key = document.createElement("span");
        key.className = "weapon-quick-key";
        key.textContent = index + 1;
        slot.append(key);
        weaponQuickSelect.append(slot);
    });
}

function replaceActiveMonsters() {
    const previous = activeMonsters.map((monster) => ({
        position: monster.position.clone(),
        health: monster.userData.health,
        speed: monster.userData.speed,
        attackCooldown: monster.userData.attackCooldown
    }));
    clearMonsters();
    for (const saved of previous) {
        createMonster(saved.position);
        const monster = activeMonsters[activeMonsters.length - 1];
        monster.userData.health = saved.health;
        monster.userData.speed = saved.speed;
        monster.userData.attackCooldown = saved.attackCooldown;
    }
}

function createMonster(position, requestedVariantName) {
    const availableVariants = requestedVariantName
        ? monsterVariants.filter((candidate) => candidate.name === requestedVariantName)
        : monsterVariants.filter((candidate) => !candidate.isBoss && candidate.name !== "Wither Skeleton");
    const variant = availableVariants.length
        ? availableVariants[Math.floor(Math.random() * availableVariants.length)]
        : null;
    const monster = variant
        ? normalizeActor(cloneSkinnedModel(variant.model), variant.isBoss ? 4.5 : ACTOR_HEIGHT)
        : createPlaceholderMonster();
    if (position) {
        monster.position.copy(position);
    } else {
        const isCreeper = variant?.name === "Minecraft Creeper";
        let spawnPosition = null;
        let farthestFromBomb = null;
        let farthestBombDistance = -Infinity;
        const attempts = isCreeper ? 40 : 1;
        for (let attempt = 0; attempt < attempts; attempt += 1) {
            const candidate = new THREE.Vector3(
                THREE.MathUtils.randFloat(-worldBounds.halfWidth, worldBounds.halfWidth),
                0,
                THREE.MathUtils.randFloat(-worldBounds.halfDepth, worldBounds.halfDepth)
            );
            if (candidate.distanceTo(playerPosition) < 5) {
                candidate.x = THREE.MathUtils.clamp(
                    candidate.x + (candidate.x < 0 ? -5 : 5),
                    -worldBounds.halfWidth,
                    worldBounds.halfWidth
                );
            }

            const bombDistance = bombPosition
                ? Math.hypot(candidate.x - bombPosition.x, candidate.z - bombPosition.z)
                : Infinity;
            if (bombDistance > farthestBombDistance) {
                farthestFromBomb = candidate.clone();
                farthestBombDistance = bombDistance;
            }
            if (!isCreeper || bombDistance >= CREEPER_BOMB_SPAWN_CLEARANCE) {
                spawnPosition = candidate;
                break;
            }
        }
        monster.position.copy(spawnPosition ?? farthestFromBomb);
    }
    monster.userData.health = requestedVariantName === "Wither Skeleton"
        ? 8
        : requestedVariantName === "Wither"
            ? WITHER_MAX_HEALTH
            : 2 + Math.floor(level / 2);
    monster.userData.speed = requestedVariantName === "Wither Skeleton"
        ? 4.3
        : BASE_MONSTER_SPEED * MONSTER_LEVEL_SPEED_MULTIPLIER ** (level - 1);
    monster.userData.variantName = requestedVariantName ?? variant?.name ?? "Placeholder";
    monster.userData.isBoss = Boolean(variant?.isBoss) || requestedVariantName === "Wither";
    monster.userData.facingOffset = variant?.facingOffset ?? 0;
    monster.userData.projectileTemplate = variant?.projectileTemplate ?? null;
    monster.userData.projectileForward = variant?.projectileForward ?? null;
    monster.userData.projectileNodeName = variant?.projectileNodeName ?? null;
    attachMonsterAnimations(monster, variant?.animations ?? []);
    if (variant?.proceduralWalk) {
        const legs = [];
        monster.traverse((part) => {
            if (/^leg[0-3]/i.test(part.name)) {
                legs.push({
                    part,
                    baseRotation: part.rotation.clone(),
                    phase: legs.length % 2 === 0 ? 0 : Math.PI
                });
            }
        });
        monster.userData.proceduralLegs = legs;
        monster.userData.walkCycle = Math.random() * Math.PI * 2;
    }
    monster.traverse((part) => {
        if (part.isMesh) part.userData.monster = monster;
    });
    scene.add(monster);
    activeMonsters.push(monster);
    updateMobCounter();
}

function spawnWitherSkeletons(boss, count = 4) {
    for (let index = 0; index < count; index += 1) {
        const angle = (index / count) * Math.PI * 2;
        const position = new THREE.Vector3(
            THREE.MathUtils.clamp(
                boss.position.x + Math.cos(angle) * 3,
                -worldBounds.halfWidth,
                worldBounds.halfWidth
            ),
            0,
            THREE.MathUtils.clamp(
                boss.position.z + Math.sin(angle) * 3,
                -worldBounds.halfDepth,
                worldBounds.halfDepth
            )
        );
        createMonster(position, "Wither Skeleton");
        activeMonsters[activeMonsters.length - 1].userData.summonedByBoss = true;
    }
    updateHud();
}

function playSound(soundId, shouldLoop = false) {
    const effect = SOUND_EFFECTS[soundId];
    if (!effect || unavailableSoundEffects.has(soundId)) return;
    let playback = soundEffectPlayback.get(soundId);
    if (!playback) {
        playback = new Audio(effect.url.href);
        playback.preload = "auto";
        playback.addEventListener("error", () => {
            unavailableSoundEffects.add(soundId);
            reportSoundError(soundId, playback.error);
        }, { once: true });
        soundEffectPlayback.set(soundId, playback);
    }
    const playbackLayer = soundId === "turretShoot" && shouldLoop
        ? getTurretSoundPlaybackLayer()
        : null;
    setSoundPlaybackVolume(soundId, playback);
    playback.playbackRate = 1;
    playback.loop = shouldLoop;
    if (shouldLoop) {
        if (playbackLayer) {
            playbackLayer.loop = true;
            if (playbackLayer.paused || playbackLayer.ended) {
                playbackLayer.currentTime = 0;
                playbackLayer.play().catch((error) => {
                    if (error.name !== "AbortError") reportSoundError(soundId, error);
                });
            }
        }
        if (!playback.paused && !playback.ended) return;
        playback.currentTime = 0;
        playback.play().catch((error) => {
            if (error.name === "AbortError") return;
            if (error.name !== "NotAllowedError") unavailableSoundEffects.add(soundId);
            reportSoundError(soundId, error);
        });
        return;
    }
    if (soundId === "tommyGun" && !playback.paused && !playback.ended) return;
    if (soundId === "tommyGun" && isTommyGunTriggerHeld) {
        playback.addEventListener("ended", () => {
            const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === currentWeaponId);
            if (
                isTommyGunTriggerHeld &&
                currentWeaponId === "thommy-gun" &&
                weapon &&
                getWeaponAmmo(weapon).magazine > 0
            ) {
                playSound("tommyGun");
            }
        }, { once: true });
    }
    if (soundId !== "tommyGun" && !playback.paused) {
        playback.currentTime = 0;
        return;
    }
    playback.currentTime = 0;
    playback.play().catch((error) => {
        if (error.name === "AbortError") return;
        if (error.name !== "NotAllowedError") unavailableSoundEffects.add(soundId);
        reportSoundError(soundId, error);
    });
}

function getTurretSoundPlaybackLayer() {
    if (turretSoundPlaybackLayer) return turretSoundPlaybackLayer;
    const playback = new Audio(SOUND_EFFECTS.turretShoot.url.href);
    playback.preload = "auto";
    playback.addEventListener("error", () => {
        reportSoundError("turretShoot", playback.error);
    }, { once: true });
    turretSoundPlaybackLayer = playback;
    return playback;
}

function playRandomWitherSound(type) {
    const soundIds = [1, 2, 3, 4].map((index) => `wither${type}${index}`);
    const availableSounds = soundIds.filter((soundId) => {
        const playback = soundEffectPlayback.get(soundId);
        return !unavailableSoundEffects.has(soundId) &&
            (!playback || playback.paused || playback.ended);
    });
    if (!availableSounds.length) return;
    const soundId = availableSounds[Math.floor(Math.random() * availableSounds.length)];
    playSound(soundId);
}

function stopWitherIdleSounds() {
    for (let index = 1; index <= 4; index += 1) {
        stopSound(`witherIdle${index}`);
    }
}

function stopSound(soundId) {
    const playback = soundEffectPlayback.get(soundId);
    if (!playback) return;
    const playbacks = soundId === "turretShoot" && turretSoundPlaybackLayer
        ? [playback, turretSoundPlaybackLayer]
        : [playback];
    for (const sound of playbacks) {
        sound.pause();
        sound.currentTime = 0;
    }
}

function createWitherSkullTemplate(model) {
    model.updateMatrixWorld(true);
    const sourceSkull = model.getObjectByName("Object_26");
    if (!sourceSkull?.isMesh) return null;

    const geometry = sourceSkull.geometry.clone().applyMatrix4(sourceSkull.matrixWorld);
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox;
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        geometry.dispose();
        throw new Error("The Wither's side skull has no usable geometry.");
    }

    const center = bounds.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.scale(0.85 / longestSide, 0.85 / longestSide, 0.85 / longestSide);
    geometry.computeBoundingSphere();
    const template = new THREE.Mesh(geometry, sourceSkull.material);
    template.name = "wither-skull-projectile-template";
    template.castShadow = false;
    return {
        template,
        forward: new THREE.Vector3(0, 0, -1).transformDirection(sourceSkull.matrixWorld)
    };
}

function reportSoundError(soundId, error) {
    if (reportedSoundErrors.has(soundId)) return;
    reportedSoundErrors.add(soundId);
    console.warn(`Unable to play the ${soundId} sound effect.`, error);
}

function createPlaceholderPlayer() {
    const player = new THREE.Group();
    player.scale.setScalar(PLAYER_MODEL_SCALE);
    const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.38, 0.9, 4, 10),
        new THREE.MeshStandardMaterial({ color: 0x65a9d4, roughness: 0.7 })
    );
    body.position.y = 0.9;
    body.castShadow = true;
    player.add(body);

    const face = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0xf0c9b8, roughness: 0.8 })
    );
    face.position.y = 1.72;
    face.castShadow = true;
    player.add(face);
    return player;
}

function createPlaceholderMonster() {
    const monster = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 16, 12),
        new THREE.MeshStandardMaterial({
            color: 0x9959a6,
            emissive: 0x28112f,
            roughness: 0.65
        })
    );
    body.position.y = 0.9;
    body.castShadow = true;
    monster.add(body);

    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffd5a1 });
    for (const x of [-0.24, 0.24]) {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), eyeMaterial);
        eye.position.set(x, 1.02, 0.59);
        monster.add(eye);
    }
    return monster;
}

function startGame(skipToLastLevel = false) {
    clearBombExplosionWave();
    removeShieldShop();
    clearTurrets();
    roundIntermissionRemaining = null;
    roundCountdownDisplay.hidden = true;
    roundCountdownDisplay.textContent = "";
    isPlaying = false;
    isPaused = false;
    isTommyGunTriggerHeld = false;
    stopSound("tommyGun");
    ownedWeaponIds.clear();
    ownedWeaponIds.add("pistol");
    if (skipToLastLevel) ownedWeaponIds.add("toaster");
    currentWeaponId = skipToLastLevel ? "toaster" : "pistol";
    health = PLAYER_MAX_HEALTH;
    dabloons = STARTING_DABLOONS;
    clearAmmoDrops();
    clearRareDrops();
    resetWeaponAmmo();
    if (skipToLastLevel) {
        const toaster = WEAPON_DEFINITIONS.find((weapon) => weapon.id === "toaster");
        getWeaponAmmo(toaster).reserve = 30;
    }
    equipCurrentWeapon();
    updateWeaponQuickSelect();
    weaponFireCooldown = 0;
    level = skipToLastLevel ? LEVEL_COUNT : 1;
    playerYaw = 0;
    cameraYaw = 0;
    cameraSideIndex = 0;
    cameraPitch = CAMERA_START_PITCH;
    cameraDistance = CAMERA_START_DISTANCE;
    bombHealth = BOMB_MAX_HEALTH;
    bombShieldHealth = 0;
    bombShieldPurchased = false;
    magnetPurchased = false;
    bombShieldObject = null;
    resetPlayerPosition();
    placeBomb();
    if (skipToLastLevel) {
        for (let index = 0; index < TURRET_MAX_COUNT; index += 1) {
            if (!createTurret() || !attachTurretCrown(turretInstances[turretInstances.length - 1])) {
                clearTurrets();
                console.error("Could not set up four upgraded turrets for the final-level test.");
                screenDescription.textContent = "Could not set up four upgraded turrets for the final-level test.";
                return;
            }
            turretInstances[turretInstances.length - 1].upgraded = true;
        }
    }
    gameScreen.hidden = true;
    volumeControl.hidden = true;
    skipToLastLevelButton.hidden = true;
    isPlaying = true;
    updateHud();
    clearMonsters();
    startLevel();
    requestPointerLock();
}

function startLevel() {
    if (level === LEVEL_COUNT) {
        clearHostileProjectiles();
        if (createShieldShop()) {
            if (beginShieldShopIntro()) return;
            removeShieldShop();
        }
        startWitherBossLevel();
        return;
    }

    const monsterCount = MONSTERS_PER_LEVEL + (level - 1) * MONSTERS_PER_LEVEL_INCREASE;
    for (let index = 0; index < monsterCount; index += 1) {
        createMonster();
    }
    updateHud();
    showMessage(`Level ${level}`);
}

function startWitherBossLevel() {
    createMonster(undefined, "Wither");
    const boss = activeMonsters[activeMonsters.length - 1];
    boss.userData.health = WITHER_MAX_HEALTH;
    boss.userData.speed = 1.8;
    boss.userData.summonCooldown = 8;
    boss.userData.hoverPhase = Math.random() * Math.PI * 2;
    boss.userData.idleSoundCooldown = THREE.MathUtils.randFloat(2, 5);
    boss.position.y = 3.5;
    bossCreeperSpawnRemaining = WITHER_CREEPER_SPAWN_DELAY;
    updateHud();
    showMessage(`The Wither has arrived! Creepers arrive in ${WITHER_CREEPER_SPAWN_DELAY} seconds.`);
}

function onGamePointerDown(event) {
    if (!isPlaying || isPaused || shieldShopIntro || gameScreen.hidden === false) return;
    if (event.button !== 0 || document.pointerLockElement !== frame) return;
    const currentWeapon = WEAPON_DEFINITIONS.find((weapon) => weapon.id === currentWeaponId);
    if (currentWeapon?.autoFire) {
        isTommyGunTriggerHeld = true;
        if (
            !reloadingWeaponId &&
            getWeaponAmmo(currentWeapon).magazine > 0
        ) {
            playSound("tommyGun");
        }
    }
    shoot();
}

function onGamePointerUp(event) {
    if (event.button !== 0) return;
    isTommyGunTriggerHeld = false;
    stopSound("tommyGun");
}

function getWeaponAmmo(weapon) {
    let ammo = weaponAmmo.get(weapon.id);
    if (!ammo) {
        ammo = {
            magazine: ownedWeaponIds.has(weapon.id) ? weapon.magazineSize : 0,
            reserve: ownedWeaponIds.has(weapon.id) ? weapon.startingReserve : 0
        };
        weaponAmmo.set(weapon.id, ammo);
    }
    return ammo;
}

function resetWeaponAmmo() {
    weaponAmmo.clear();
    for (const weapon of WEAPON_DEFINITIONS) {
        weaponAmmo.set(weapon.id, ownedWeaponIds.has(weapon.id)
            ? { magazine: weapon.magazineSize, reserve: weapon.startingReserve }
            : { magazine: 0, reserve: 0 });
    }
    reloadTimer = 0;
    reloadingWeaponId = null;
}

function reloadCurrentWeapon() {
    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === currentWeaponId);
    if (!weapon || reloadingWeaponId) return;
    const ammo = getWeaponAmmo(weapon);
    if (ammo.magazine >= weapon.magazineSize) {
        showMessage("Magazine is already full.");
        return;
    }
    if (ammo.reserve <= 0) {
        showMessage("No reserve ammo. Find an ammo box.");
        return;
    }
    reloadingWeaponId = weapon.id;
    reloadTimer = weapon.reloadDuration;
    if (weapon.id === "thommy-gun") stopSound("tommyGun");
    showMessage(`Reloading ${weapon.name}...`);
    updateHud();
}

function updateAmmoReload(delta) {
    if (!reloadingWeaponId || !isPlaying || isPaused) return;
    reloadTimer = Math.max(0, reloadTimer - delta);
    if (reloadTimer > 0) return;

    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === reloadingWeaponId);
    if (weapon) {
        const ammo = getWeaponAmmo(weapon);
        const roundsToLoad = Math.min(weapon.magazineSize - ammo.magazine, ammo.reserve);
        ammo.magazine += roundsToLoad;
        ammo.reserve -= roundsToLoad;
        showMessage(`${weapon.name} reloaded`);
    }
    reloadingWeaponId = null;
    updateHud();
    if (isTommyGunTriggerHeld && currentWeaponId === "thommy-gun") playSound("tommyGun");
}

function shoot() {
    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === currentWeaponId);
    if (!weapon) return;
    if (reloadingWeaponId) return;
    if (weaponFireCooldown > 0) return;
    const ammo = getWeaponAmmo(weapon);
    if (ammo.magazine <= 0) {
        if (weapon.id === "thommy-gun") stopSound("tommyGun");
        const now = performance.now();
        if (now - lastEmptyAmmoMessageTime >= 1200) {
            lastEmptyAmmoMessageTime = now;
            showMessage("Out of ammo! Press R to reload.");
        }
        return;
    }
    if (weapon.projectileType === "rocket" ? !rocketTemplate : weapon.id !== "shuriken" && !bulletTemplate) {
        showMessage(weapon.projectileType === "rocket" ? "Toaster rocket is unavailable." : "Bullet model is not available.");
        return;
    }

    scene.updateMatrixWorld(true);
    raycaster.setFromCamera(getCrosshairNdcPosition(), camera);
    raycaster.near = 0;
    raycaster.far = weapon.range ?? 150;
    const monsterParts = activeMonsters.flatMap((monster) => {
        const parts = [];
        monster.traverse((part) => {
            if (part.isMesh) parts.push(part);
        });
        return parts;
    });
    const aimedHit = raycaster.intersectObjects(monsterParts, false)[0];
    const aimPoint = aimedHit
        ? aimedHit.point
        : raycaster.ray.origin.clone().addScaledVector(raycaster.ray.direction, raycaster.far);
    const origin = playerPosition.clone().add(new THREE.Vector3(0, 1.2, 0));
    const aimDirection = aimPoint.clone().sub(origin).normalize();
    const projectileCount = weapon.pelletCount ?? 1;
    for (let index = 0; index < projectileCount; index += 1) {
        const direction = aimDirection.clone();
        if (weapon.spread) {
            const horizontal = THREE.MathUtils.randFloatSpread(weapon.spread);
            const vertical = THREE.MathUtils.randFloatSpread(weapon.spread);
            direction.addScaledVector(new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion), horizontal);
            direction.addScaledVector(new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion), vertical);
            direction.normalize();
        }
        createWeaponProjectile(weapon, origin, direction);
    }
    ammo.magazine -= 1;
    weaponFireCooldown = 1 / Math.max(weapon.fireRate ?? 1, 0.1);
    updateHud();
    const weaponSound = {
        pistol: "pistol",
        shotgun: "shotgun",
        sniper: "sniper",
        toaster: "toaster"
    }[weapon.id];
    if (weaponSound) playSound(weaponSound);
}

function getCrosshairNdcPosition() {
    const frameBounds = frame.getBoundingClientRect();
    const crosshairBounds = crosshair.getBoundingClientRect();
    return new THREE.Vector2(
        ((crosshairBounds.left + crosshairBounds.width / 2 - frameBounds.left) / frameBounds.width) * 2 - 1,
        1 - ((crosshairBounds.top + crosshairBounds.height / 2 - frameBounds.top) / frameBounds.height) * 2
    );
}

function createWeaponProjectile(weapon, origin, direction, onlyTargetsCreepers = false) {
    const isShuriken = weapon.id === "shuriken";
    const isRocket = weapon.projectileType === "rocket";
    const template = isRocket
        ? rocketTemplate
        : isShuriken
            ? weaponTemplates.get("shuriken")
            : bulletTemplate;
    if (!template) {
        console.error(`Cannot fire ${weapon.name}: its projectile model is not loaded.`);
        showMessage(`${weapon.name} projectile is unavailable.`);
        return;
    }
    const model = cloneSkinnedModel(template);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error(`Cannot fire ${weapon.name}: its projectile model has no usable 3D geometry.`);
        return;
    }

    const projectile = new THREE.Group();
    const targetSize = isRocket ? 2.1 : isShuriken ? 0.45 : 0.32;
    const modelScale = targetSize / longestSide;
    model.scale.multiplyScalar(modelScale);
    model.position.set(
        -((bounds.min.x + bounds.max.x) / 2) * modelScale,
        -((bounds.min.y + bounds.max.y) / 2) * modelScale,
        -((bounds.min.z + bounds.max.z) / 2) * modelScale
    );
    if (isShuriken) model.rotation.set(...weapon.rotation);
    else model.rotation.y = -Math.PI / 2;
    projectile.add(model);
    projectile.position.copy(origin);
    projectile.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
    projectile.userData.velocity = direction.clone().multiplyScalar(isRocket ? 24 : isShuriken ? 24 : 38);
    projectile.userData.damage = weapon.damage ?? 1;
    projectile.userData.remainingRange = weapon.range ?? 150;
    projectile.userData.spin = isShuriken ? 14 : 0;
    projectile.userData.isRocket = isRocket;
    projectile.userData.onlyTargetsCreepers = onlyTargetsCreepers;
    projectile.userData.blastRadius = isRocket ? 4 : 0;
    scene.add(projectile);
    activeProjectiles.push(projectile);
}

function damageMonster(monster, damage) {
    if (!activeMonsters.includes(monster)) return;
    monster.userData.health -= damage;
    if (monster.userData.health <= 0) {
        spawnMoneyDrop(monster);
        spawnAmmoDrop(monster);
        spawnRareCollectibleDrop(monster);
        if (monster.userData.isBoss) {
            stopWitherIdleSounds();
            playSound("witherDeath");
            showMessage("The Wither is defeated!");
        }
        scene.remove(monster);
        if (monster.userData.mixer) actorMixers.delete(monster.userData.mixer);
        activeMonsters = activeMonsters.filter((active) => active !== monster);
        updateMobCounter();
        updateHud();
        if (activeMonsters.length === 0) finishLevel();
    } else {
        if (monster.userData.isBoss) {
            playRandomWitherSound("Hurt");
            updateHud();
        }
    }
}

function spawnAmmoDrop(monster) {
    if (!ammoDropTemplate || Math.random() >= AMMO_DROP_CHANCE) return;
    const weapon = AMMO_DROP_WEAPONS[Math.floor(Math.random() * AMMO_DROP_WEAPONS.length)];
    const placement = findMobDropPlacement(monster);
    if (!placement) return;

    const model = cloneSkinnedModel(ammoDropTemplate);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error("The ammo drop model has no usable 3D geometry.");
        return;
    }

    const scale = 0.8 / longestSide;
    model.scale.multiplyScalar(scale);
    model.position.set(
        -((bounds.min.x + bounds.max.x) / 2) * scale,
        -bounds.min.y * scale,
        -((bounds.min.z + bounds.max.z) / 2) * scale
    );
    const object = new THREE.Group();
    object.name = "ammo-drop";
    object.add(model);
    object.position.set(placement.x, placement.ground.height + 0.12, placement.z);
    object.userData.weaponId = weapon.id;
    object.userData.baseY = object.position.y;
    object.userData.floatPhase = Math.random() * Math.PI * 2;
    scene.add(object);
    ammoDrops.push(object);
}

function updateAmmoDrops(delta) {
    for (let index = ammoDrops.length - 1; index >= 0; index -= 1) {
        const drop = ammoDrops[index];
        drop.rotation.y += delta * 0.8;
        drop.position.y = drop.userData.baseY +
            Math.sin(performance.now() / 400 + drop.userData.floatPhase) * 0.1;
        attractMobDrop(drop, delta);
        if (Math.hypot(
            playerPosition.x - drop.position.x,
            playerPosition.z - drop.position.z
        ) > 1.8) continue;

        const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === drop.userData.weaponId);
        if (!weapon) {
            console.error(`The ammo drop references an unknown weapon: ${drop.userData.weaponId}`);
            scene.remove(drop);
            ammoDrops.splice(index, 1);
            continue;
        }
        const ammo = getWeaponAmmo(weapon);
        const rounds = weapon.ammoDropAmount;
        ammo.reserve += rounds;
        scene.remove(drop);
        ammoDrops.splice(index, 1);
        showMessage(`Picked up ${rounds} ${weapon.name} ammo`);
        updateHud();
    }
}

function clearAmmoDrops() {
    for (const drop of ammoDrops) scene.remove(drop);
    ammoDrops.length = 0;
}

function attractMobDrop(drop, delta) {
    if (!magnetPurchased) return;
    const offsetX = playerPosition.x - drop.position.x;
    const offsetZ = playerPosition.z - drop.position.z;
    const distance = Math.hypot(offsetX, offsetZ);
    if (distance === 0 || distance > MAGNET_ATTRACTION_RADIUS) return;

    const travelDistance = Math.min(distance, MAGNET_ATTRACTION_SPEED * delta);
    drop.position.x += (offsetX / distance) * travelDistance;
    drop.position.z += (offsetZ / distance) * travelDistance;
}

function spawnMoneyDrop(monster) {
    if (!moneyDropTemplate) return;
    const placement = findMobDropPlacement(monster);
    if (!placement) return;

    const model = cloneSkinnedModel(moneyDropTemplate);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error("The money drop model has no usable 3D geometry.");
        return;
    }

    const scale = 0.8 / longestSide;
    model.scale.multiplyScalar(scale);
    model.position.set(
        -((bounds.min.x + bounds.max.x) / 2) * scale,
        -bounds.min.y * scale,
        -((bounds.min.z + bounds.max.z) / 2) * scale
    );
    const object = new THREE.Group();
    object.name = "money-drop";
    object.add(model);
    object.position.set(placement.x, placement.ground.height + 0.12, placement.z);
    object.userData.dropType = "money";
    object.userData.baseY = object.position.y;
    object.userData.floatPhase = Math.random() * Math.PI * 2;
    scene.add(object);
    rareDrops.push(object);
}

function findMobDropPlacement(monster) {
    const dropIndex = monster.userData.dropPlacementIndex ?? 0;
    monster.userData.dropPlacementIndex = dropIndex + 1;
    const rotation = monster.userData.dropSpreadRotation ??
        (monster.userData.dropSpreadRotation = Math.random() * Math.PI * 2);
    const angle = rotation + dropIndex * (2 * Math.PI / 3);
    const x = monster.position.x + Math.cos(angle) * MOB_DROP_SPREAD_RADIUS;
    const z = monster.position.z + Math.sin(angle) * MOB_DROP_SPREAD_RADIUS;
    const ground = findGroundAt(x, z);
    if (!ground || ground.normalY < 0.5) return null;
    return { x, z, ground };
}

function spawnRareCollectibleDrop(monster) {
    const dropChance = ownedWeaponIds.has("toaster")
        ? TOASTER_COLLECTIBLE_DROP_CHANCE
        : RARE_COLLECTIBLE_DROP_CHANCE;
    if (Math.random() >= dropChance) return;
    const dropType = Math.random() < 0.5 ? "smallbomb" : "rainbow";
    const template = rareDropTemplates.get(dropType);
    if (!template) return;

    const model = cloneSkinnedModel(template);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error(`The ${dropType} collectible has no usable 3D geometry.`);
        return;
    }

    const scale = 0.8 / longestSide;
    model.scale.multiplyScalar(scale);
    model.position.set(
        -((bounds.min.x + bounds.max.x) / 2) * scale,
        -bounds.min.y * scale,
        -((bounds.min.z + bounds.max.z) / 2) * scale
    );
    const placement = findMobDropPlacement(monster);
    if (!placement) return;

    const object = new THREE.Group();
    object.name = `${dropType}-collectible`;
    object.add(model);
    object.position.set(placement.x, placement.ground.height + 0.12, placement.z);
    object.userData.dropType = dropType;
    object.userData.baseY = object.position.y;
    object.userData.floatPhase = Math.random() * Math.PI * 2;
    scene.add(object);
    rareDrops.push(object);
}

function updateRareDrops(delta) {
    for (let index = rareDrops.length - 1; index >= 0; index -= 1) {
        const drop = rareDrops[index];
        drop.rotation.y += delta * 0.8;
        drop.position.y = drop.userData.baseY +
            Math.sin(performance.now() / 400 + drop.userData.floatPhase) * 0.1;
        attractMobDrop(drop, delta);
        if (Math.hypot(
            playerPosition.x - drop.position.x,
            playerPosition.z - drop.position.z
        ) > 1.8) continue;

        const dropType = drop.userData.dropType;
        if (dropType === "money") {
            dabloons += MONEY_DROP_VALUE;
        } else if (dropType in rareDropCounts) {
            rareDropCounts[dropType] += 1;
        } else {
            console.error(`The collectible drop references an unknown item: ${dropType}`);
            scene.remove(drop);
            rareDrops.splice(index, 1);
            continue;
        }
        scene.remove(drop);
        rareDrops.splice(index, 1);
        updateHud();
        showMessage(dropType === "money"
            ? `Picked up ${MONEY_DROP_VALUE} Dabloons`
            : `Picked up ${dropType === "smallbomb" ? "a Small Bomb" : "a Rainbow"}`);
    }
}

function clearRareDrops() {
    for (const drop of rareDrops) scene.remove(drop);
    rareDrops.length = 0;
}

function updateProjectiles(delta) {
    scene.updateMatrixWorld(true);
    const monsterParts = activeMonsters.flatMap((monster) => {
        const parts = [];
        monster.traverse((part) => {
            if (part.isMesh) parts.push(part);
        });
        return parts;
    });
    const creeperParts = monsterParts.filter(
        (part) => part.userData.monster?.userData.variantName === "Minecraft Creeper"
    );
    const rocketSurfaces = [
        ...mapColliders,
        treeInstancesRoot,
        mysteryBoxObject,
        bombObject
    ].filter(Boolean);
    for (let index = activeProjectiles.length - 1; index >= 0; index -= 1) {
        const projectile = activeProjectiles[index];
        const velocity = projectile.userData.velocity;
        const stepLength = Math.min(velocity.length() * delta, projectile.userData.remainingRange);
        const step = velocity.clone().normalize().multiplyScalar(stepLength);
        projectile.rotateZ(projectile.userData.spin * delta);
        raycaster.set(projectile.position, velocity.clone().normalize());
        raycaster.near = 0;
        raycaster.far = step.length() + 0.2;
        const monsterPartsToCheck = projectile.userData.onlyTargetsCreepers
            ? creeperParts
            : monsterParts;
        const monsterHit = raycaster.intersectObjects(monsterPartsToCheck, false)[0];
        const surfaceHit = projectile.userData.isRocket
            ? raycaster.intersectObjects(rocketSurfaces, true)[0]
            : null;
        const hit = monsterHit && (!surfaceHit || monsterHit.distance <= surfaceHit.distance)
            ? monsterHit
            : surfaceHit;
        if (hit) {
            if (projectile.userData.isRocket) {
                explodeRocket(hit.point, projectile.userData.damage, projectile.userData.blastRadius);
            } else if (hit.object.userData.monster) {
                damageMonster(hit.object.userData.monster, projectile.userData.damage);
            }
            removeProjectile(index);
            continue;
        }
        projectile.position.add(step);
        projectile.userData.remainingRange -= stepLength;
        if (projectile.userData.remainingRange <= 0) removeProjectile(index);
    }
}

function updateHostileProjectiles(delta) {
    if (!isPlaying || isPaused) return;
    const playerTarget = getPlayerHitboxPosition().add(new THREE.Vector3(0, 0.8, 0));
    const impactSurfaces = [
        ...mapColliders,
        treeInstancesRoot,
        mysteryBoxObject,
        bombObject
    ].filter(Boolean);
    for (let index = hostileProjectiles.length - 1; index >= 0; index -= 1) {
        const projectile = hostileProjectiles[index];
        const velocity = projectile.userData.velocity;
        const chaseDelta = projectile.userData.homing
            ? Math.min(delta, projectile.userData.chaseTimeRemaining)
            : delta;
        if (projectile.userData.homing && chaseDelta > 0) {
            const targetDirection = playerTarget.clone().sub(projectile.position).normalize();
            const direction = velocity.clone().normalize()
                .lerp(targetDirection, Math.min(1, WITHER_HOMING_TURN_RATE * chaseDelta))
                .normalize();
            velocity.copy(direction.multiplyScalar(projectile.userData.speed));
            if (projectile.userData.projectileForward) {
                projectile.quaternion.setFromUnitVectors(
                    projectile.userData.projectileForward,
                    direction
                );
            }
            projectile.userData.chaseTimeRemaining -= chaseDelta;
        }
        const step = velocity.clone().multiplyScalar(chaseDelta);
        const stepLength = step.length();
        const direction = stepLength ? step.clone().normalize() : new THREE.Vector3();
        const playerDistance = stepLength
            ? THREE.MathUtils.clamp(
                playerTarget.clone().sub(projectile.position).dot(direction),
                0,
                stepLength
            )
            : 0;
        const closestPoint = projectile.position.clone().addScaledVector(direction, playerDistance);
        const hitsPlayer = closestPoint.distanceTo(playerTarget) <= 0.85;
        raycaster.set(projectile.position, direction);
        raycaster.near = 0;
        raycaster.far = stepLength;
        const surfaceHit = stepLength
            ? raycaster.intersectObjects(impactSurfaces, true)[0]
            : null;
        if (hitsPlayer && (!surfaceHit || playerDistance <= surfaceHit.distance)) {
            createWitherExplosion(closestPoint);
            scene.remove(projectile);
            hostileProjectiles.splice(index, 1);
            health = Math.max(0, health - 15);
            showMessage("Hit by a Wither blast!");
            updateHud();
            if (health === 0) endGame();
            continue;
        }
        if (surfaceHit) {
            createWitherExplosion(surfaceHit.point);
            scene.remove(projectile);
            hostileProjectiles.splice(index, 1);
            continue;
        }

        projectile.position.add(step);
        projectile.userData.remainingRange -= step.length();
        if (projectile.userData.homing && projectile.userData.chaseTimeRemaining <= 0) {
            createWitherExplosion(projectile.position);
            scene.remove(projectile);
            hostileProjectiles.splice(index, 1);
            continue;
        }
        if (projectile.userData.remainingRange <= 0) {
            scene.remove(projectile);
            hostileProjectiles.splice(index, 1);
        }
    }
}

function createWitherProjectile(boss, targetPosition) {
    const projectileNode = boss.userData.projectileNodeName
        ? boss.getObjectByName(boss.userData.projectileNodeName)
        : null;
    const projectile = boss.userData.projectileTemplate?.clone()
        ?? new THREE.Mesh(WITHER_PROJECTILE_GEOMETRY, WITHER_PROJECTILE_MATERIAL);
    boss.updateMatrixWorld(true);
    const origin = projectileNode
        ? projectileNode.getWorldPosition(new THREE.Vector3())
        : boss.position.clone().add(new THREE.Vector3(0, 0.4, 0));
    const direction = targetPosition.clone().add(new THREE.Vector3(0, 0.8, 0))
        .sub(origin)
        .normalize();
    projectile.position.copy(origin);
    const projectileForward = boss.userData.projectileForward?.clone()
        ?? new THREE.Vector3(0, 0, -1);
    projectile.quaternion.setFromUnitVectors(projectileForward, direction);
    projectile.userData.projectileForward = projectileForward;
    const projectileSpeed = 18;
    projectile.userData.velocity = direction.multiplyScalar(projectileSpeed);
    projectile.userData.homing = boss.userData.health <= WITHER_HOMING_HEALTH_THRESHOLD;
    projectile.userData.chaseTimeRemaining = projectile.userData.homing
        ? WITHER_HOMING_CHASE_DURATION
        : 0;
    projectile.userData.speed = projectileSpeed;
    projectile.userData.remainingRange = 70;
    projectile.castShadow = false;
    scene.add(projectile);
    hostileProjectiles.push(projectile);
}

function explodeRocket(position, damage, radius) {
    playSound("toasterGunExplosion");
    createRainbowImpactParticles(position);
    if (!rocketExplosionTemplate) {
        console.error("Cannot show the toaster explosion: its model is not loaded.");
        return;
    }
    const effect = cloneSkinnedModel(rocketExplosionTemplate);
    const bounds = new THREE.Box3().setFromObject(effect);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error("Cannot show the toaster explosion: its model has no usable 3D geometry.");
        return;
    }

    const explosion = new THREE.Group();
    const targetSize = radius * 1.8;
    const scale = targetSize / longestSide;
    effect.scale.multiplyScalar(scale);
    effect.position.set(
        -((bounds.min.x + bounds.max.x) / 2) * scale,
        -((bounds.min.y + bounds.max.y) / 2) * scale,
        -((bounds.min.z + bounds.max.z) / 2) * scale
    );
    explosion.add(effect);
    explosion.position.copy(position);
    scene.add(explosion);

    const nearbyMonsters = [...activeMonsters].filter((monster) =>
        monster.position.distanceTo(position) <= radius
    );
    for (const monster of nearbyMonsters) damageMonster(monster, damage);

    if (rocketExplosionAnimations.length) {
        const mixer = new THREE.AnimationMixer(effect);
        const action = mixer.clipAction(rocketExplosionAnimations[0]);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        mixer.addEventListener("finished", () => {
            actorMixers.delete(mixer);
            scene.remove(explosion);
        });
        actorMixers.add(mixer);
        action.play();
    } else {
        window.setTimeout(() => scene.remove(explosion), 900);
    }
}

function createRainbowImpactParticles(position) {
    const positions = new Float32Array(RAINBOW_PARTICLE_COUNT * 3);
    const colors = new Float32Array(RAINBOW_PARTICLE_COUNT * 3);
    const velocities = [];
    for (let index = 0; index < RAINBOW_PARTICLE_COUNT; index += 1) {
        const direction = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize();
        direction.y += 0.35;
        velocities.push(direction.normalize().multiplyScalar(2.2 + Math.random() * 3.2));
        new THREE.Color(RAINBOW_PARTICLE_COLORS[index % RAINBOW_PARTICLE_COLORS.length])
            .toArray(colors, index * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        depthWrite: false
    });
    const particles = new THREE.Points(geometry, material);
    particles.position.copy(position);
    particles.frustumCulled = false;
    scene.add(particles);
    activeRainbowParticleEffects.add({ particles, velocities, age: 0 });
}

function updateRainbowImpactParticles(delta) {
    for (const effect of activeRainbowParticleEffects) {
        effect.age += delta;
        if (effect.age >= RAINBOW_PARTICLE_LIFETIME) {
            scene.remove(effect.particles);
            effect.particles.geometry.dispose();
            effect.particles.material.dispose();
            activeRainbowParticleEffects.delete(effect);
            continue;
        }

        const positionAttribute = effect.particles.geometry.getAttribute("position");
        for (let index = 0; index < effect.velocities.length; index += 1) {
            const velocity = effect.velocities[index];
            velocity.y -= 3.5 * delta;
            positionAttribute.setXYZ(
                index,
                positionAttribute.getX(index) + velocity.x * delta,
                positionAttribute.getY(index) + velocity.y * delta,
                positionAttribute.getZ(index) + velocity.z * delta
            );
        }
        positionAttribute.needsUpdate = true;
        effect.particles.material.opacity = 1 - effect.age / RAINBOW_PARTICLE_LIFETIME;
    }
}

function removeProjectile(index) {
    scene.remove(activeProjectiles[index]);
    activeProjectiles.splice(index, 1);
}

function clearProjectiles() {
    for (const projectile of activeProjectiles) scene.remove(projectile);
    activeProjectiles.length = 0;
}

function clearHostileProjectiles() {
    for (const projectile of hostileProjectiles) scene.remove(projectile);
    hostileProjectiles.length = 0;
}

function finishLevel() {
    if (level === LEVEL_COUNT) {
        bossCreeperSpawnRemaining = 0;
        roundIntermissionRemaining = null;
        roundCountdownDisplay.hidden = true;
        isPlaying = false;
        screenTitle.textContent = "The Wither is defeated!";
        screenDescription.textContent = SECRET_MESSAGE;
        startButton.textContent = "Play again";
        skipToLastLevelButton.hidden = false;
        gameScreen.hidden = false;
        return;
    }

    level += 1;
    roundIntermissionRemaining = ROUND_INTERMISSION_DURATION;
    roundCountdownDisplay.hidden = true;
    showMessage("Level cleared!");
}

function updateRoundIntermission(delta) {
    if (roundIntermissionRemaining === null) return;
    if (!isPlaying) {
        roundIntermissionRemaining = null;
        roundCountdownDisplay.hidden = true;
        return;
    }
    if (isPaused) return;

    roundIntermissionRemaining = Math.max(0, roundIntermissionRemaining - delta);
    const secondsRemaining = Math.ceil(roundIntermissionRemaining);
    if (secondsRemaining > 0 && secondsRemaining <= ROUND_COUNTDOWN_DURATION) {
        roundCountdownDisplay.textContent = `Level ${level} starts in ${secondsRemaining}`;
        roundCountdownDisplay.hidden = false;
    } else {
        roundCountdownDisplay.hidden = true;
    }

    if (roundIntermissionRemaining > 0) return;
    roundIntermissionRemaining = null;
    roundCountdownDisplay.hidden = true;
    roundCountdownDisplay.textContent = "";
    startLevel();
}

function updateMobCounter() {
    mobCounter.textContent = `Mobs: ${activeMonsters.length}`;
}

function updateHud() {
    levelDisplay.textContent = `Level ${level}`;
    const fullHeartCount = Math.ceil(health / 20);
    healthHeartDisplays.forEach((heart, index) => {
        heart.src = index < fullHeartCount
            ? FULL_HEART_IMAGE_URL.href
            : EMPTY_HEART_IMAGE_URL.href;
    });
    healthDisplay.setAttribute(
        "aria-label",
        `Health ${health} of ${PLAYER_MAX_HEALTH}; ${fullHeartCount} of 5 hearts`
    );
    const boss = activeMonsters.find((monster) => monster.userData.isBoss);
    bossDisplay.hidden = !boss;
    if (boss) {
        const bossHealth = Math.max(0, boss.userData.health);
        const fullWitherHeartCount = Math.ceil(bossHealth / WITHER_HEALTH_PER_HEART);
        witherHeartDisplays.forEach((heart, index) => {
            heart.src = index < fullWitherHeartCount
                ? WITHER_FULL_HEART_IMAGE_URL.href
                : WITHER_EMPTY_HEART_IMAGE_URL.href;
        });
        bossDisplay.setAttribute(
            "aria-label",
            `Wither health ${Math.ceil(bossHealth)} of ${WITHER_MAX_HEALTH}; ${fullWitherHeartCount} of ${witherHeartDisplays.length} hearts`
        );
    }
    dabloonValueDisplay.textContent = `$${dabloons}`;
    dabloonDisplay.setAttribute("aria-label", `Dabloons ${dabloons}`);
    smallbombCounterValue.textContent = rareDropCounts.smallbomb;
    smallbombCounter.setAttribute("aria-label", `Small Bombs: ${rareDropCounts.smallbomb}`);
    rainbowCounterValue.textContent = rareDropCounts.rainbow;
    rainbowCounter.setAttribute("aria-label", `Rainbows: ${rareDropCounts.rainbow}`);
    updateCraftingStation();
    const bombIconCount = BOMB_MAX_HEALTH / BOMB_HEALTH_PER_ICON;
    const remainingBombs = Math.ceil(bombHealth / BOMB_HEALTH_PER_ICON);
    const remainingShieldIcons = Math.ceil(
        bombShieldHealth / BOMB_SHIELD_HEALTH_PER_ICON
    );
    const shieldHealthDescription = bombShieldHealth > 0
        ? `; shield health ${bombShieldHealth} of ${BOMB_SHIELD_MAX_HEALTH}; ${remainingShieldIcons} of ${bombShieldDisplays.length} shield icons remaining`
        : "";
    bombDisplay.setAttribute(
        "aria-label",
        `Bomb health ${bombHealth} of ${BOMB_MAX_HEALTH}; ${remainingBombs} of ${bombIconCount} health icons remaining${shieldHealthDescription}`
    );
    bombShieldStatus.hidden = bombShieldHealth <= 0;
    bombShieldDisplays.forEach((shield, index) => {
        shield.src = index < remainingShieldIcons
            ? FULL_SHIELD_IMAGE_URL.href
            : EMPTY_SHIELD_IMAGE_URL.href;
    });
    if (bombHudRenderer && bombHudScene && bombHudCamera) {
        bombHudIcons.forEach(({ materials }, index) => {
            const active = index < remainingBombs;
            for (const material of materials) {
                material.opacity = active ? 1 : 0.2;
            }
        });
        bombHudRenderer.render(bombHudScene, bombHudCamera);
    } else {
        bombHealthFallback.hidden = false;
        bombHealthFallback.textContent = bombHealth > 0
            ? `Bomb ${bombHealth}/${BOMB_MAX_HEALTH}`
            : "Bomb destroyed";
    }
    const currentWeapon = WEAPON_DEFINITIONS.find((weapon) => weapon.id === currentWeaponId);
    if (currentWeapon) {
        const ammo = getWeaponAmmo(currentWeapon);
        ammoValueDisplay.textContent = reloadingWeaponId === currentWeapon.id
            ? "RELOAD"
            : `${ammo.magazine} / ${ammo.reserve}`;
        ammoDisplay.setAttribute(
            "aria-label",
            reloadingWeaponId === currentWeapon.id
                ? `Reloading ${currentWeapon.name}; ${ammo.magazine} rounds in magazine, ${ammo.reserve} in reserve`
                : `Ammo ${ammo.magazine} in magazine, ${ammo.reserve} in reserve`
        );
    } else {
        ammoValueDisplay.textContent = "0 / 0";
        ammoDisplay.setAttribute("aria-label", "Ammo unavailable");
    }
}

function showMessage(message) {
    gameMessage.textContent = message;
    window.clearTimeout(messageTimeout);
    messageTimeout = window.setTimeout(() => {
        gameMessage.textContent = "";
    }, 1000);
}

function clearMonsters() {
    bossCreeperSpawnRemaining = 0;
    clearProjectiles();
    clearHostileProjectiles();
    stopWitherIdleSounds();
    for (const monster of activeMonsters) {
        scene.remove(monster);
        if (monster.userData.mixer) actorMixers.delete(monster.userData.mixer);
    }
    activeMonsters = [];
    updateMobCounter();
}

function onKeyDown(event) {
    if (shieldShopIntro && event.code !== "Escape" && event.code !== "KeyF") return;
    if (event.code === "KeyR" && !event.repeat && isPlaying && !isPaused) {
        reloadCurrentWeapon();
    }
    if (event.code === "KeyE" && !event.repeat && isPlaying && !isPaused) {
        if (tryUpgradeNearbyTurret()) return;
        if (isNearCraftingTable()) {
            void tryCraftToaster();
            return;
        }
        if (tryPurchaseBombShield()) return;
        if (tryPurchaseFromShop()) return;
        tryOpenMysteryBox();
    }
    if (/^Digit[1-6]$/.test(event.code) && !event.repeat && isPlaying && !isPaused) {
        selectWeapon(WEAPON_DEFINITIONS[Number(event.code.slice(-1)) - 1].id);
    }
    if (event.code === "KeyQ" && !event.repeat && isPlaying && !isPaused) {
        cameraSideIndex = (cameraSideIndex + 1) % 4;
        showMessage(`Camera view ${cameraSideIndex + 1}/4`);
    }
    if (event.code === "Space" && isPlaying && !isPaused) {
        event.preventDefault();
        if (!event.repeat && isPlayerGrounded) {
            playerVerticalVelocity = PLAYER_JUMP_SPEED;
            isPlayerGrounded = false;
        }
    }
    keys.add(event.code);
    if (event.code === "KeyF" && !event.repeat) {
        toggleFullscreen();
        return;
    }
    if (event.code === "Escape" && isPlaying) {
        pauseGame();
    }
}

function selectWeapon(weaponId) {
    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === weaponId);
    if (!weapon || !ownedWeaponIds.has(weaponId)) {
        showMessage("You haven't unlocked that weapon yet.");
        return;
    }
    isTommyGunTriggerHeld = false;
    stopSound("tommyGun");
    reloadTimer = 0;
    reloadingWeaponId = null;
    weaponFireCooldown = 0;
    currentWeaponId = weaponId;
    equipCurrentWeapon();
    updateWeaponQuickSelect();
    updateHud();
    showMessage(`${weapon.name} equipped`);
}

function pauseGame() {
    if (!isPlaying || isPaused) return;
    isPaused = true;
    mysteryBoxPrompt.hidden = true;
    gameScreen.hidden = false;
    volumeControl.hidden = false;
    screenTitle.textContent = "Paused";
    screenDescription.textContent = "";
    startButton.textContent = "Resume";
    if (document.pointerLockElement === frame) document.exitPointerLock();
}

function resumeGame() {
    gameScreen.hidden = true;
    volumeControl.hidden = true;
    isPaused = false;
    requestPointerLock();
}

function requestPointerLock() {
    if (!frame.requestPointerLock || document.pointerLockElement === frame) return;
    try {
        const lockRequest = frame.requestPointerLock();
        if (lockRequest && typeof lockRequest.catch === "function") {
            lockRequest.catch(onPointerLockError);
        }
    } catch (error) {
        onPointerLockError(error);
    }
}

function onPointerLockChange() {
    const locked = document.pointerLockElement === frame;
    frame.classList.toggle("pointer-locked", locked);
    if (locked) {
        hadPointerLock = true;
        return;
    }
    isTommyGunTriggerHeld = false;
    stopSound("tommyGun");
    weaponFireCooldown = 0;
    if (!hadPointerLock) return;
    hadPointerLock = false;
    if (isPlaying && !isPaused) pauseGame();
}

function onPointerLockError() {
    showMessage("Click the game to center the cursor. Use Live Server if it cannot lock.");
}

function onCameraMouseMove(event) {
    if (
        !isPlaying ||
        isPaused ||
        shieldShopIntro ||
        document.pointerLockElement !== frame
    ) return;

    cameraYaw -= event.movementX * 0.0025;
    cameraPitch = THREE.MathUtils.clamp(
        cameraPitch + event.movementY * 0.002,
        getCameraMinPitch(),
        CAMERA_MAX_PITCH
    );
    playerYaw = Math.PI + cameraYaw;
    playerObject.rotation.y = playerYaw;
}

function onCameraZoom(event) {
    event.preventDefault();
    if (shieldShopIntro) return;
    cameraDistance = THREE.MathUtils.clamp(
        cameraDistance + event.deltaY * 0.01,
        CAMERA_MIN_DISTANCE,
        CAMERA_MAX_DISTANCE
    );
    cameraPitch = THREE.MathUtils.clamp(
        cameraPitch,
        getCameraMinPitch(),
        CAMERA_MAX_PITCH
    );
}

function getCameraMinPitch() {
    const verticalOffset = Math.min(
        PLAYER_HEAD_HEIGHT - CAMERA_FLOOR_CLEARANCE,
        cameraDistance
    );
    return -Math.asin(verticalOffset / cameraDistance);
}

function movePlayer(delta) {
    if (!isPlaying || isPaused) return;
    const nearbyShop = findNearbyShop();
    const nearbyTurret = findNearbyTurret();
    const nearBombShield = isNearBombShieldPurchase();
    const nearCraftingTable = isNearCraftingTable();
    const nearMysteryBox = isNearMysteryBox();
    craftingStation.hidden = !nearCraftingTable || Boolean(nearbyTurret);
    mysteryBoxPrompt.hidden =
        !nearbyShop && !nearbyTurret && !nearBombShield && !nearMysteryBox;
    if (nearbyTurret) {
        mysteryBoxPrompt.textContent = !turretCrownTemplate
            ? "Turret upgrades unavailable"
            : nearbyTurret.upgraded
                ? "Turret already upgraded"
                : `Press E to upgrade turret · ${TURRET_UPGRADE_COST} Dabloons`;
    } else if (nearBombShield) {
        mysteryBoxPrompt.textContent = bombShieldPurchased
            ? "Bomb shield already purchased"
            : bombHealth <= 0 || !bombObject?.visible
                ? "The bomb cannot be shielded right now"
                : !bombShieldTemplate
                    ? "Bomb shield unavailable"
                    : `Press E to buy bomb shield · ${BOMB_SHIELD_COST} Dabloons`;
    } else if (nearbyShop?.type === "magnet") {
        mysteryBoxPrompt.textContent = magnetPurchased
            ? "Magnet purchased · nearby mob drops are attracted"
            : `Press E to buy magnet · ${MAGNET_COST} Dabloons`;
    } else if (nearbyShop?.type === "turret") {
        mysteryBoxPrompt.textContent = turretInstances.length >= TURRET_MAX_COUNT
            ? `Turret limit reached · ${TURRET_MAX_COUNT} max`
            : `Press E to buy from Animal King - ${getNextTurretCost()} Dabloons`;
    } else if (nearbyShop?.type === "healing") {
        mysteryBoxPrompt.textContent = `Press E to heal 3 hearts · ${HEALING_SHOP_COST} Dabloons`;
    } else if (nearbyShop?.type === "ammo") {
        const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === currentWeaponId);
        mysteryBoxPrompt.textContent = weapon?.id === "toaster"
            ? "Toaster ammo must be crafted at the crafting table"
            : `Press E for ${weapon?.magazineSize ?? 0} ${weapon?.name ?? "weapon"} reserve ammo · ${AMMO_SHOP_COST} Dabloons`;
    } else if (nearMysteryBox) {
        mysteryBoxPrompt.textContent = `Press E to open · ${MYSTERY_BOX_COST} Dabloons · Weapon roulette`;
    } else {
        mysteryBoxPrompt.textContent = "";
    }
    if (nearMysteryBox) preloadMysteryBoxWeapons();
    if (!isPlayerGrounded) {
        playerVerticalVelocity -= PLAYER_GRAVITY * delta;
        playerPosition.y += playerVerticalVelocity * delta;
        const ground = findGroundAt(playerPosition.x, playerPosition.z);
        if (ground && playerVerticalVelocity <= 0 && playerPosition.y <= ground.height) {
            playerGroundHeight = ground.height;
            playerPosition.y = playerGroundHeight;
            playerVerticalVelocity = 0;
            isPlayerGrounded = true;
        }
    }
    const forward = Number(keys.has("KeyW")) - Number(keys.has("KeyS"));
    const sideways = Number(keys.has("KeyD")) - Number(keys.has("KeyA"));
    if (forward || sideways) {
        const direction = new THREE.Vector3(sideways, 0, -forward)
            .normalize()
            .applyAxisAngle(new THREE.Vector3(0, 1, 0), getEffectiveCameraYaw());
        const distance = PLAYER_SPEED * delta;
        const candidate = playerPosition.clone().addScaledVector(direction, distance);
        candidate.x = THREE.MathUtils.clamp(candidate.x, -worldBounds.halfWidth, worldBounds.halfWidth);
        candidate.z = THREE.MathUtils.clamp(candidate.z, -worldBounds.halfDepth, worldBounds.halfDepth);
        const ground = isPlayerGrounded ? findGroundAt(candidate.x, candidate.z) : null;
        const canFollowGround = !isPlayerGrounded
            || (ground && ground.height - playerGroundHeight <= 0.75 && playerGroundHeight - ground.height <= 1.25);
        if (canFollowGround && canMoveTo(candidate, direction, distance)) {
            playerPosition.copy(candidate);
            if (isPlayerGrounded) {
                playerGroundHeight = ground.height;
                playerPosition.y = playerGroundHeight;
            }
        }
    }
    playerObject.position.copy(playerPosition);
    playerObject.rotation.y = playerYaw;
}

function canMoveTo(candidate, direction, distance) {
    if (staticObstacles.some((obstacle) =>
        Math.hypot(candidate.x - obstacle.x, candidate.z - obstacle.z) <
            obstacle.radius + 0.45
    )) return false;
    if (!mapColliders.length) return true;
    raycaster.set(
        new THREE.Vector3(playerPosition.x, 0.85, playerPosition.z),
        direction
    );
    raycaster.near = 0;
    raycaster.far = distance + 0.45;
    const obstruction = raycaster.intersectObjects(mapColliders, false)[0];
    return !obstruction || obstruction.distance > distance + 0.2;
}

function updateCamera() {
    if (bombExplosionWave) {
        const wave = bombExplosionWave;
        const cameraMoveProgress = THREE.MathUtils.smoothstep(
            wave.elapsed,
            0,
            BOMB_EXPLOSION_CAMERA_MOVE_DURATION
        );
        const cameraPosition = wave.cameraPosition.clone()
            .addScaledVector(
                wave.followDirection,
                BOMB_EXPLOSION_CAMERA_MOVE_DISTANCE * cameraMoveProgress
            );
        camera.up.set(0, 1, 0);
        camera.position.copy(cameraPosition);
        camera.lookAt(wave.cameraLookTarget);
        return;
    }

    camera.up.set(0, 1, 0);
    const horizontalDistance = cameraDistance * Math.cos(cameraPitch);
    const height = cameraDistance * Math.sin(cameraPitch);
    const behind = new THREE.Vector3(
        Math.sin(getEffectiveCameraYaw()),
        0,
        Math.cos(getEffectiveCameraYaw())
    );
    const headPosition = new THREE.Vector3(
        playerPosition.x,
        playerPosition.y + PLAYER_HEAD_HEIGHT,
        playerPosition.z
    );
    camera.position.set(
        headPosition.x + behind.x * horizontalDistance,
        headPosition.y + height,
        headPosition.z + behind.z * horizontalDistance
    );
    camera.lookAt(headPosition);
}

function getEffectiveCameraYaw() {
    return cameraYaw + cameraSideIndex * Math.PI / 2;
}

function updateMonsters(delta) {
    if (!isPlaying || isPaused) return;
    updateBossCreeperSpawn(delta);
    for (const monster of [...activeMonsters]) {
        if (!activeMonsters.includes(monster)) continue;
        if (monster.userData.isBoss) {
            updateWitherBoss(monster, delta);
            continue;
        }
        const isCreeper = monster.userData.variantName === "Minecraft Creeper";
        const isTargetingBomb = isCreeper && bombHealth > 0 && bombObject?.visible;
        const targetPosition = isTargetingBomb ? bombPosition : getPlayerHitboxPosition();
        const towardPlayer = new THREE.Vector3(
            targetPosition.x - monster.position.x,
            0,
            targetPosition.z - monster.position.z
        );
        const distance = towardPlayer.length();
        if (isCreeper && distance <= CREEPER_EXPLOSION_DISTANCE && explosionTemplate) {
            explodeCreeper(monster, isTargetingBomb);
            continue;
        }
        const stopDistance = isTargetingBomb ? CREEPER_EXPLOSION_DISTANCE : 1.3;
        if (distance > stopDistance) {
            monster.position.addScaledVector(towardPlayer.normalize(), monster.userData.speed * delta);
            monster.lookAt(targetPosition.x, monster.position.y, targetPosition.z);
            monster.rotation.y += monster.userData.facingOffset;
            setMonsterAnimation(monster, monster.userData.walkAction);
            updateProceduralMonsterWalk(monster, delta, true);
        } else if (isTargetingBomb) {
            updateProceduralMonsterWalk(monster, delta, false);
        } else {
            updateProceduralMonsterWalk(monster, delta, false);
            monster.userData.attackCooldown = (monster.userData.attackCooldown || 0) - delta;
            if (monster.userData.attackCooldown <= 0) {
                health = Math.max(0, health - 10);
                monster.userData.attackCooldown = 1.2;
                if (monster.userData.attackAction) {
                    setMonsterAnimation(monster, monster.userData.attackAction);
                }
                updateHud();
                if (health === 0) endGame();
            } else if (monster.userData.currentAction !== monster.userData.attackAction) {
                setMonsterAnimation(monster, null);
            }
        }
    }
}

function updateBossCreeperSpawn(delta) {
    if (bossCreeperSpawnRemaining <= 0) return;
    if (
        level !== LEVEL_COUNT ||
        !activeMonsters.some((monster) => monster.userData.isBoss)
    ) {
        bossCreeperSpawnRemaining = 0;
        return;
    }

    bossCreeperSpawnRemaining = Math.max(0, bossCreeperSpawnRemaining - delta);
    if (bossCreeperSpawnRemaining > 0) return;
    for (let index = 0; index < WITHER_LEVEL_CREEPER_COUNT; index += 1) {
        createMonster(undefined, "Minecraft Creeper");
    }
    bossCreeperSpawnRemaining = WITHER_CREEPER_SPAWN_INTERVAL;
    updateHud();
}

function updateTurrets(delta) {
    if (!isPlaying || isPaused || !bulletTemplate) {
        stopSound("turretShoot");
        return;
    }
    const creepers = activeMonsters.filter(
        (monster) => monster.userData.variantName === "Minecraft Creeper"
    );
    if (!creepers.length) {
        stopSound("turretShoot");
        return;
    }

    let hasTargetInRange = false;
    for (const turret of turretInstances) {
        const statMultiplier = turret.upgraded ? TURRET_UPGRADE_STAT_MULTIPLIER : 1;
        turret.fireCooldown = Math.max(0, turret.fireCooldown - delta);
        let target = null;
        let closestDistance = TURRET_RANGE;
        for (const creeper of creepers) {
            const distance = Math.hypot(
                turret.object.position.x - creeper.position.x,
                turret.object.position.z - creeper.position.z
            );
            if (distance <= closestDistance) {
                target = creeper;
                closestDistance = distance;
            }
        }
        if (!target) continue;
        hasTargetInRange = true;
        if (turret.fireCooldown > 0) continue;

        const origin = turret.object.position.clone();
        origin.y += 1.4;
        const targetPosition = target.position.clone();
        targetPosition.y += 0.8;
        const direction = targetPosition.sub(origin).normalize();
        turret.object.rotation.y = Math.atan2(direction.x, direction.z);
        const spreadUp = Math.abs(direction.y) > 0.99
            ? new THREE.Vector3(1, 0, 0)
            : new THREE.Vector3(0, 1, 0);
        const spreadRight = new THREE.Vector3().crossVectors(direction, spreadUp).normalize();
        const spreadVertical = new THREE.Vector3().crossVectors(spreadRight, direction).normalize();
        const projectileDirection = direction.clone()
            .addScaledVector(spreadRight, THREE.MathUtils.randFloatSpread(TURRET_SPREAD))
            .addScaledVector(spreadVertical, THREE.MathUtils.randFloatSpread(TURRET_SPREAD))
            .normalize();
        const weapon = turret.upgraded || level === LEVEL_COUNT
            ? {
                ...TURRET_WEAPON,
                damage: (level === LEVEL_COUNT ? TURRET_FINAL_LEVEL_DAMAGE : TURRET_BULLET_DAMAGE) * statMultiplier
            }
            : TURRET_WEAPON;
        createWeaponProjectile(weapon, origin, projectileDirection);
        if (turret.fireActions.length) {
            for (const action of turret.fireActions) action.stop();
            if (turret.idleAction) turret.idleAction.stop();
            const fireAction = turret.fireActions[
                turret.nextFireAnimationIndex % turret.fireActions.length
            ];
            turret.nextFireAnimationIndex += 1;
            fireAction.reset().play();
        }
        turret.fireCooldown = TURRET_FIRE_INTERVAL / statMultiplier;
    }
    if (hasTargetInRange) playSound("turretShoot", true);
    else stopSound("turretShoot");
}

function updateWitherBoss(boss, delta) {
    const targetPosition = getPlayerHitboxPosition();
    const towardPlayer = new THREE.Vector3(
        targetPosition.x - boss.position.x,
        0,
        targetPosition.z - boss.position.z
    );
    const distance = towardPlayer.length();
    if (distance > 11) {
        boss.position.addScaledVector(towardPlayer.normalize(), boss.userData.speed * delta);
    } else if (distance < 7) {
        boss.position.addScaledVector(towardPlayer.normalize(), -boss.userData.speed * delta);
    }
    boss.userData.hoverPhase += delta * 1.8;
    boss.position.y = 3.5 + Math.sin(boss.userData.hoverPhase) * 0.55;
    boss.lookAt(targetPosition.x, boss.position.y, targetPosition.z);
    boss.rotation.y += boss.userData.facingOffset;

    boss.userData.summonCooldown -= delta;
    if (boss.userData.summonCooldown <= 0) {
        const summonedSkeletons = activeMonsters.filter((monster) => monster.userData.summonedByBoss).length;
        if (summonedSkeletons < 4) {
            spawnWitherSkeletons(boss, 4 - summonedSkeletons);
            showMessage("The Wither summons its skeletons!");
        }
        boss.userData.summonCooldown = 14;
    }

    boss.userData.attackCooldown = (boss.userData.attackCooldown ?? WITHER_SHOOT_COOLDOWN) - delta;
    boss.userData.idleSoundCooldown -= delta;
    const shootAction = boss.userData.shootAction ?? boss.userData.attackAction;
    if (
        boss.userData.attackCooldown <= 0 &&
        distance < 70 &&
        !shootAction?.isRunning()
    ) {
        boss.userData.attackCooldown = WITHER_SHOOT_COOLDOWN;
        stopWitherIdleSounds();
        playSound("witherShoot");
        createWitherProjectile(boss, targetPosition);
        if (shootAction) setMonsterAnimation(boss, shootAction);
    } else if (
        boss.userData.currentAction === boss.userData.shootAction &&
        !boss.userData.shootAction?.isRunning()
    ) {
        setMonsterAnimation(boss, boss.userData.flyAction);
    }
    if (
        boss.userData.currentAction !== shootAction &&
        boss.userData.idleSoundCooldown <= 0
    ) {
        playRandomWitherSound("Idle");
        boss.userData.idleSoundCooldown = THREE.MathUtils.randFloat(7, 12);
    }
}

function createWitherExplosion(position) {
    if (!witherExplosionTemplate) return;
    const effect = cloneSkinnedModel(witherExplosionTemplate);
    const bounds = new THREE.Box3().setFromObject(effect);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error("The Wither explosion effect has no usable 3D geometry.");
        return;
    }

    const scale = (3.5 * 1.25) / longestSide;
    effect.scale.multiplyScalar(scale);
    effect.position.multiplyScalar(scale);
    effect.position.sub(bounds.getCenter(new THREE.Vector3()).multiplyScalar(scale));
    const explosion = new THREE.Group();
    explosion.position.copy(position);
    explosion.add(effect);
    scene.add(explosion);

    let mixer = null;
    const removeExplosion = () => {
        if (mixer) actorMixers.delete(mixer);
        scene.remove(explosion);
    };
    if (witherExplosionAnimations.length) {
        mixer = new THREE.AnimationMixer(effect);
        const action = mixer.clipAction(witherExplosionAnimations[0]);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = false;
        mixer.addEventListener("finished", removeExplosion, { once: true });
        actorMixers.add(mixer);
        action.play();
    } else {
        window.setTimeout(removeExplosion, 1200);
    }
}

function createBombExplosionWave() {
    clearBombExplosionWave();
    const center = bombPosition.clone();
    const followDirection = getPlayerHitboxPosition().sub(center);
    followDirection.y = 0;
    if (followDirection.lengthSq() > 0) followDirection.normalize();
    else followDirection.set(0, 0, -1);
    const towardExplosion = followDirection.clone().negate();
    playerYaw = Math.atan2(towardExplosion.x, towardExplosion.z);
    cameraYaw = playerYaw - Math.PI - cameraSideIndex * Math.PI / 2;
    playerObject.rotation.y = playerYaw;
    const cameraSide = new THREE.Vector3(followDirection.z, 0, -followDirection.x);
    const cameraPosition = playerPosition.clone()
        .addScaledVector(followDirection, BOMB_EXPLOSION_CAMERA_BACK_OFFSET)
        .addScaledVector(cameraSide, BOMB_EXPLOSION_CAMERA_SIDE_OFFSET);
    cameraPosition.y = playerPosition.y + BOMB_EXPLOSION_CAMERA_HEIGHT;
    const cameraLookTarget = center.clone()
        .addScaledVector(followDirection, BOMB_EXPLOSION_CAMERA_LOOK_DISTANCE);
    cameraLookTarget.y += 1;
    const maxRadius = Math.hypot(
        Math.abs(center.x) + worldBounds.halfWidth,
        Math.abs(center.z) + worldBounds.halfDepth
    ) + BOMB_EXPLOSION_EDGE_MARGIN;
    const wave = {
        center,
        followDirection,
        radius: BOMB_EXPLOSION_INITIAL_RADIUS,
        growthSpeed: BOMB_EXPLOSION_INITIAL_SPEED,
        maxRadius,
        cameraPosition,
        cameraLookTarget,
        elapsed: 0,
        finishedElapsed: 0,
        object: null,
        mixer: null,
        playerHit: false
    };
    bombExplosionWave = wave;
    playSound("nukeExplosion");

    if (!explosionTemplate) {
        console.error("Cannot show the bomb explosion: its model is not loaded.");
        return;
    }

    const effect = cloneSkinnedModel(explosionTemplate);
    const bounds = new THREE.Box3().setFromObject(effect);
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(longestSide) || longestSide <= 0) {
        console.error("Cannot show the bomb explosion: its model has no usable 3D geometry.");
        return;
    }

    const modelScale = 1 / longestSide;
    const model = new THREE.Group();
    model.position.copy(bounds.getCenter(new THREE.Vector3()).negate());
    model.scale.setScalar(modelScale);
    model.add(effect);

    const explosion = new THREE.Group();
    explosion.position.copy(center);
    explosion.scale.setScalar(wave.radius * 2);
    explosion.add(model);
    wave.object = explosion;

    const mixer = new THREE.AnimationMixer(effect);
    const action = mixer.clipAction(explosionAnimations[0]);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    mixer.addEventListener("finished", () => {
        actorMixers.delete(mixer);
        if (wave.mixer === mixer) wave.mixer = null;
    }, { once: true });
    wave.mixer = mixer;
    action.play();
    mixer.update(0);
    scene.add(explosion);
}

function updateBombExplosionWave(delta) {
    const wave = bombExplosionWave;
    if (!wave) return;

    const simulationDelta = delta * getBombExplosionTimeScale();
    wave.elapsed += delta;
    wave.mixer?.update(simulationDelta);
    wave.growthSpeed += BOMB_EXPLOSION_ACCELERATION * simulationDelta;
    wave.radius = Math.min(
        wave.maxRadius,
        wave.radius + wave.growthSpeed * simulationDelta
    );
    if (wave.elapsed >= BOMB_EXPLOSION_BOMB_HIDE_DELAY) {
        bombObject.visible = false;
    }
    wave.object?.scale.setScalar(wave.radius * 2);
    const progress = wave.radius / wave.maxRadius;
    const flashProgress = THREE.MathUtils.smoothstep(
        progress,
        0,
        BOMB_EXPLOSION_FLASH_RADIUS_RATIO
    );
    bombFlashOverlay.style.opacity = String(flashProgress);
    frame.style.filter = `brightness(${1 + flashProgress * 2})`;

    const playerPosition = getPlayerHitboxPosition();
    if (
        !wave.playerHit &&
        health > 0 &&
        Math.hypot(
            playerPosition.x - wave.center.x,
            playerPosition.z - wave.center.z
        ) <= wave.radius
    ) {
        wave.playerHit = true;
        health = 0;
        updateHud();
        endGame();
    }

    if (wave.radius >= wave.maxRadius) {
        wave.finishedElapsed += delta;
        if (wave.finishedElapsed >= 1) finishBombExplosionWave();
    }
}

function getBombExplosionTimeScale() {
    if (!bombExplosionWave) return 1;
    const progress = THREE.MathUtils.smoothstep(
        bombExplosionWave.elapsed,
        0,
        BOMB_EXPLOSION_ACCELERATION_DURATION
    );
    return THREE.MathUtils.lerp(
        BOMB_EXPLOSION_SLOW_MOTION_SCALE,
        BOMB_EXPLOSION_MAX_TIME_SCALE,
        progress
    );
}

function finishBombExplosionWave() {
    if (!bombExplosionWave) return;
    if (bombExplosionWave.mixer) {
        bombExplosionWave.mixer.stopAllAction();
        actorMixers.delete(bombExplosionWave.mixer);
    }
    if (bombExplosionWave.object) scene.remove(bombExplosionWave.object);
    bombExplosionWave = null;
}

function clearBombExplosionWave() {
    finishBombExplosionWave();
    bombFlashOverlay.style.opacity = "0";
    frame.style.filter = "";
    stopSound("nukeExplosion");
}

function explodeCreeper(creeper, damagesBomb = false) {
    playSound("creeperExplosion");
    const effect = cloneSkinnedModel(explosionTemplate);
    const explosion = new THREE.Group();
    explosion.add(effect);
    explosion.position.copy(creeper.position);
    scene.add(explosion);

    const mixer = new THREE.AnimationMixer(effect);
    const action = mixer.clipAction(explosionAnimations[0]);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    mixer.addEventListener("finished", () => {
        actorMixers.delete(mixer);
        scene.remove(explosion);
    });
    actorMixers.add(mixer);
    action.play();

    if (creeper.userData.mixer) actorMixers.delete(creeper.userData.mixer);
    scene.remove(creeper);
    activeMonsters = activeMonsters.filter((monster) => monster !== creeper);
    updateMobCounter();
    if (damagesBomb && bombHealth > 0) {
        if (bombShieldHealth > 0) {
            bombShieldHealth = Math.max(0, bombShieldHealth - CREEPER_BOMB_DAMAGE);
            if (bombShieldHealth === 0) {
                removeBombShield();
                showMessage("The bomb shield broke; the bomb was protected.");
            } else {
                showMessage(`Bomb shield absorbed the blast · ${bombShieldHealth} health left.`);
            }
        } else {
            bombHealth = Math.max(0, bombHealth - CREEPER_BOMB_DAMAGE);
            if (bombHealth === 0) {
                bombObject.visible = true;
                showMessage("The bomb was destroyed!");
                createBombExplosionWave();
            }
        }
    }
    if (getPlayerHitboxPosition().distanceTo(creeper.position) <= CREEPER_EXPLOSION_DISTANCE + 1) {
        health = Math.max(0, health - CREEPER_EXPLOSION_DAMAGE);
    }
    updateHud();
    if (health === 0) endGame();
    else if (activeMonsters.length === 0) finishLevel();
}

function getPlayerHitboxPosition() {
    const playerFront = new THREE.Vector3(0, 0, 1)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw);
    return playerPosition.clone().addScaledVector(playerFront, PLAYER_HITBOX_FORWARD_OFFSET);
}

function updateProceduralMonsterWalk(monster, delta, isWalking) {
    const legs = monster.userData.proceduralLegs;
    if (!legs?.length) return;
    if (isWalking) monster.userData.walkCycle += delta * 4.5;
    for (const { part, baseRotation, phase } of legs) {
        part.rotation.x = baseRotation.x + (isWalking
            ? Math.sin(monster.userData.walkCycle + phase) * 0.4
            : 0);
        part.rotation.y = baseRotation.y;
        part.rotation.z = baseRotation.z;
    }
}

function endGame() {
    bossCreeperSpawnRemaining = 0;
    isPlaying = false;
    mysteryBoxPrompt.hidden = true;
    volumeControl.hidden = true;
    frame.style.filter = "";
    screenTitle.textContent = "game over D:";
    screenDescription.textContent = "";
    startButton.textContent = "Try again";
    skipToLastLevelButton.hidden = false;
    gameScreen.hidden = false;
}

function resizeScene() {
    if (!renderer || !camera) return;
    const { width, height } = frame.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
}

function render() {
    const delta = Math.min(clock.getDelta(), 0.05);
    if (shieldShopIntro) {
        updateShieldShopIntro(delta);
        renderer.render(scene, camera);
        return;
    }
    const simulationDelta = delta * getBombExplosionTimeScale();
    updateShieldShopHover(simulationDelta);
    updateWeaponFire(simulationDelta);
    updateAmmoReload(simulationDelta);
    updateIntroCamera(simulationDelta);
    movePlayer(simulationDelta);
    updateAmmoDrops(simulationDelta);
    updateRareDrops(simulationDelta);
    updateMonsters(simulationDelta);
    updateTurrets(simulationDelta);
    updateBombExplosionWave(delta);
    updateProjectiles(simulationDelta);
    updateHostileProjectiles(simulationDelta);
    updateRainbowImpactParticles(simulationDelta);
    updateCamera();
    for (const mixer of actorMixers) mixer.update(simulationDelta);
    updateMysteryBoxRoulette(simulationDelta);
    updateRoundIntermission(delta);
    renderer.render(scene, camera);
}

function updateWeaponFire(delta) {
    weaponFireCooldown = Math.max(0, weaponFireCooldown - delta);
    if (!isTommyGunTriggerHeld || reloadingWeaponId || !isPlaying || isPaused || document.pointerLockElement !== frame) return;
    const weapon = WEAPON_DEFINITIONS.find((definition) => definition.id === currentWeaponId);
    if (weapon?.autoFire && weaponFireCooldown <= 0) {
        if (getWeaponAmmo(weapon).magazine > 0) {
            const playback = soundEffectPlayback.get("tommyGun");
            if (!playback || playback.paused || playback.ended) playSound("tommyGun");
        }
        shoot();
    }
}

function updateIntroCamera(delta) {
    if (!isIntroOrbiting) return;
    introOrbitElapsed += delta;
    const progress = Math.min(introOrbitElapsed / INTRO_ORBIT_DURATION, 1);
    cameraYaw = Math.PI * 2 * progress;
    if (progress < 1) return;

    cameraYaw = 0;
    isIntroOrbiting = false;
    gameScreen.hidden = false;
    enableGameStart();
}
