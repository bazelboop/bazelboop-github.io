const video = document.querySelector(".overlay-video");
const canvas = document.querySelector(".overlay-video-key");
const overlay = document.querySelector(".overlay-corner-box");
const secretCodeForm = document.querySelector("#secret-code-form");
const secretCodeInput = document.querySelector("#secret-code-input");
const secretCodeMessage = document.querySelector("#secret-code-message");
const textArtElements = document.querySelectorAll(".corner-text-art");
const context = canvas.getContext("2d", { willReadFrequently: true });
let startPetRoaming = () => {};
let spawnAnotherPet = () => {};
let hasVideoFinishedOnce = false;
let nextPetId = 0;

secretCodeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (secretCodeInput.value.trim() === "1113") {
        window.location.assign("game.html");
        return;
    }
    secretCodeMessage.textContent = "Try again my love : )";
    secretCodeInput.focus();
});

function syncCarriedPets(root) {
    const rootId = root.id;
    const rootX = Number.parseFloat(root.style.left);
    const rootY = Number.parseFloat(root.style.top);
    const riders = [...document.querySelectorAll(".site-pet[data-stack-root]")]
        .filter((pet) => pet.dataset.stackRoot === rootId)
        .sort((a, b) => Number(a.dataset.stackLevel) - Number(b.dataset.stackLevel));

    riders.forEach((rider) => {
        const level = Number(rider.dataset.stackLevel);
        rider.style.left = `${rootX}px`;
        rider.style.top = `${rootY - 24 * level}px`;
        rider.style.zIndex = `${Number(root.style.zIndex || 4) + level}`;
    });
}

function hasCarriedPets(root) {
    return [...document.querySelectorAll(".site-pet[data-stack-root]")]
        .some((pet) => pet.dataset.stackRoot === root.id);
}

function stackPetOn(draggedPet, supportingPet) {
    let root = supportingPet;
    while (root.dataset.stackRoot) {
        const parent = document.getElementById(root.dataset.stackRoot);
        if (!parent || parent === root) break;
        root = parent;
    }

    const newLevel = [...document.querySelectorAll(".site-pet[data-stack-root]")]
        .filter((pet) => pet.dataset.stackRoot === root.id)
        .reduce((highest, pet) => Math.max(highest, Number(pet.dataset.stackLevel)), 0) + 1;
    const oldRootId = draggedPet.id;
    const oldRiders = [...document.querySelectorAll(".site-pet[data-stack-root]")]
        .filter((pet) => pet.dataset.stackRoot === oldRootId);

    draggedPet.dataset.stackRoot = root.id;
    draggedPet.dataset.stackLevel = String(newLevel);
    draggedPet.classList.add("is-stacked");
    oldRiders.forEach((rider) => {
        rider.dataset.stackRoot = root.id;
        rider.dataset.stackLevel = String(newLevel + Number(rider.dataset.stackLevel));
    });
    syncCarriedPets(root);
}

video.loop = false;
video.muted = true;

const textArtFrames = [
    `♥  ♥   ♥  ♥   ♥  ♥   
  ♥♥     ♥♥     ♥♥    
 ♥  ♥   ♥  ♥   ♥  ♥   
  ♥♥     ♥♥     ♥♥    
 ♥  ♥   ♥  ♥   ♥  ♥   
  ♥♥     ♥♥     ♥♥    
`,
    `  ♥♥     ♥♥     ♥♥    
 ♥  ♥   ♥  ♥   ♥  ♥   
  ♥♥     ♥♥     ♥♥    
 ♥  ♥   ♥  ♥   ♥  ♥   
  ♥♥     ♥♥     ♥♥    
 
`
];

const leftTextArtFrames = [
    `       I  L O V E  Y O U       
                                
    F O R E V E R  &  A L W A Y S`,
    `    F O R E V E R  &  A L W A Y S
                                
       I  L O V E  Y O U       `
];

textArtElements.forEach((textArtElement) => {
    const frames = textArtElement.classList.contains("corner-text-art-left")
        ? leftTextArtFrames
        : textArtFrames;
    frames.forEach((frame, index) => {
        const layer = document.createElement("pre");
        layer.className = "corner-text-frame";
        layer.textContent = frame;
        layer.style.animationDelay = `${index * -0.8}s`;
        textArtElement.append(layer);
    });
});

const sitePet = document.querySelector(".site-pet");
if (sitePet) {
    sitePet.id = `shimeji-pet-${nextPetId++}`;
    const petFrames = ["shimeji/shime2.png", "shimeji/shime3.png"];
    const squares = [...document.querySelectorAll(".square")];
    const petSize = 80;
    const walkDuration = 6000;
    const jumpTravelSpeed = 300;
    const fallTravelSpeed = 240;
    const minimumTravelDuration = 400;
    const idleDuration = 700;
    const eatDuration = 2400;
    const eatFrameDuration = 250;
    const idleFrames = ["shimeji/shime1.png", "shimeji/shime20.png"];
    const eatFrames = ["shimeji eat/shime15.png", "shimeji eat/shime16.png"];
    let petX = 0;
    let petY = window.innerHeight - petSize;
    let direction = 1;
    let phase = "walking";
    let stateTime = 0;
    let travelDuration = minimumTravelDuration;
    let frameTime = 0;
    let frameIndex = 0;
    let previousTime;
    let currentSquare = -1;
    let jumpStartX = 0;
    let jumpStartY = petY;
    let targetX = 0;
    let targetY = 0;
    let jumpPeakX = 0;
    let jumpPeakY = 0;
    let animationStarted = false;
    let eatFrameIndex = 0;
    let isDragging = false;
    let fallingToDropTarget = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let dragStartY = 0;

    sitePet.style.bottom = "auto";
    sitePet.style.top = `${petY}px`;
    sitePet.draggable = false;

    function clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    function updateJumpTarget() {
        if (fallingToDropTarget) return;
        const floorPlatform = currentSquare === squares.length;
        const bounds = currentSquare >= 0 && !floorPlatform
            ? squares[currentSquare].getBoundingClientRect()
            : null;
        if (floorPlatform || !bounds || bounds.bottom <= 0 || bounds.top >= window.innerHeight) {
            currentSquare = squares.length;
            targetX = clamp(petX, 0, window.innerWidth - petSize);
            targetY = window.innerHeight - petSize;
        } else {
            const launchX = phase === "falling" ? jumpPeakX : jumpStartX;
            targetX = clamp(launchX, bounds.left, bounds.right - petSize);
            targetY = clamp(bounds.top - petSize, 0, window.innerHeight - petSize);
        }
        if (phase === "jumping") {
            fallingToDropTarget = false;
            jumpPeakY = Math.max(0, Math.min(jumpStartY, targetY) - 55);
        }
    }

    function updateRestingPosition() {
        if (currentSquare === squares.length) {
            petY = window.innerHeight - petSize;
            return;
        }

        const platform = squares[currentSquare]?.getBoundingClientRect();
        if (!platform || platform.bottom <= 0 || platform.top >= window.innerHeight) {
            currentSquare = squares.length;
            petY = window.innerHeight - petSize;
            return;
        }

        const minX = Math.max(0, platform.left);
        const maxX = Math.max(minX, Math.min(window.innerWidth - petSize, platform.right - petSize));
        petX = clamp(petX, minX, maxX);
        petY = clamp(platform.top - petSize, 0, window.innerHeight - petSize);
    }

    function beginJumpToNextSquare() {
        const platformCount = squares.length + 1;
        for (let offset = 1; offset <= platformCount; offset += 1) {
            const squareIndex = (currentSquare + offset) % platformCount;
            if (squareIndex === squares.length) {
                currentSquare = squareIndex;
                jumpStartX = petX;
                jumpStartY = petY;
                updateJumpTarget();
                setPhase("jumping");
                return true;
            }
            const bounds = squares[squareIndex].getBoundingClientRect();
            if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) continue;

            currentSquare = squareIndex;
            jumpStartX = petX;
            jumpStartY = petY;
            updateJumpTarget();
            setPhase("jumping");
            return true;
        }

        return false;
    }

    function setPhase(nextPhase) {
        if (nextPhase === "falling") {
            jumpPeakX = petX;
            jumpPeakY = petY;
        }
        phase = nextPhase;
        stateTime = 0;
        frameTime = 0;

        if (phase === "jumping") {
            jumpPeakY = Math.max(0, Math.min(jumpStartY, targetY) - 55);
            const distance = Math.hypot(
                targetX - jumpStartX,
                jumpPeakY - jumpStartY
            );
            travelDuration = Math.max(minimumTravelDuration, distance / jumpTravelSpeed * 1000);
            sitePet.src = "shimeji jump and fall/shime9.png";
        } else if (phase === "falling") {
            const distance = Math.hypot(
                targetX - jumpPeakX,
                targetY - jumpPeakY
            );
            travelDuration = Math.max(minimumTravelDuration, distance / fallTravelSpeed * 1000);
            sitePet.src = "shimeji jump and fall/shime10.png";
        } else if (phase === "idle") {
            sitePet.src = idleFrames[Math.floor(Math.random() * idleFrames.length)];
        } else if (phase === "eating") {
            eatFrameIndex = 0;
            sitePet.src = eatFrames[eatFrameIndex];
        } else {
            sitePet.src = petFrames[frameIndex];
        }
    }

    function animatePet(time) {
        if (previousTime !== undefined) {
            const delta = Math.min(time - previousTime, 50);
            if (sitePet.dataset.stackRoot && !isDragging) {
                const root = document.getElementById(sitePet.dataset.stackRoot);
                if (root) syncCarriedPets(root);
                previousTime = time;
                requestAnimationFrame(animatePet);
                return;
            }
            if (isDragging) {
                sitePet.style.left = `${petX}px`;
                sitePet.style.top = `${petY}px`;
                sitePet.style.transform = `scaleX(${direction === 1 ? -1 : 1})`;
                syncCarriedPets(sitePet);
                previousTime = time;
                requestAnimationFrame(animatePet);
                return;
            }
            stateTime += delta;
            frameTime += delta;

            if (phase === "idle" || phase === "eating") {
                updateRestingPosition();
            }

            if (phase === "walking") {
                if (currentSquare >= 0 && currentSquare < squares.length) {
                    const platform = squares[currentSquare].getBoundingClientRect();
                    if (platform.bottom <= 0 || platform.top >= window.innerHeight) {
                        currentSquare = squares.length;
                        petY = window.innerHeight - petSize;
                    }
                }
                if (currentSquare < 0) {
                    if (!beginJumpToNextSquare()) {
                        stateTime = 0;
                    }
                } else if (currentSquare === squares.length) {
                    const minX = 0;
                    const maxX = Math.max(0, window.innerWidth - petSize);
                    petY = window.innerHeight - petSize;
                    petX = clamp(petX, minX, maxX);
                    petX += direction * delta * 0.08;
                    if (petX >= maxX || petX <= minX) {
                        petX = Math.max(minX, Math.min(petX, maxX));
                        direction *= -1;
                    }
                    if (frameTime >= 180) {
                        frameIndex = 1 - frameIndex;
                        sitePet.src = petFrames[frameIndex];
                        frameTime %= 180;
                    }
                    if (stateTime >= walkDuration && !hasCarriedPets(sitePet) && !beginJumpToNextSquare()) {
                        stateTime = 0;
                    }
                } else {
                    const platform = squares[currentSquare].getBoundingClientRect();
                    const minX = Math.max(0, platform.left);
                    const maxX = Math.max(minX, Math.min(
                        window.innerWidth - petSize,
                        platform.right - petSize
                    ));
                    petY = clamp(platform.top - petSize, 0, window.innerHeight - petSize);
                    petX = clamp(petX, minX, maxX);
                    petX += direction * delta * 0.08;
                    if (petX >= maxX || petX <= minX) {
                        petX = Math.max(minX, Math.min(petX, maxX));
                        direction *= -1;
                    }
                    if (frameTime >= 180) {
                        frameIndex = 1 - frameIndex;
                        sitePet.src = petFrames[frameIndex];
                        frameTime %= 180;
                    }
                    if (stateTime >= walkDuration && !hasCarriedPets(sitePet) && !beginJumpToNextSquare()) {
                        stateTime = 0;
                    }
                }
            } else if (phase === "jumping") {
                updateJumpTarget();
                const progress = Math.min(stateTime / travelDuration, 1);
                petX = jumpStartX + (targetX - jumpStartX) * progress;
                petY = jumpStartY + (jumpPeakY - jumpStartY) * progress;
                if (targetX !== jumpStartX) {
                    direction = targetX > jumpStartX ? 1 : -1;
                }
                if (stateTime >= travelDuration) {
                    setPhase("falling");
                }
            } else if (phase === "falling") {
                if (!fallingToDropTarget) updateJumpTarget();
                const progress = Math.min(stateTime / travelDuration, 1);
                petX = jumpPeakX + (targetX - jumpPeakX) * progress;
                petY = jumpPeakY + (targetY - jumpPeakY) * progress;
                if (targetX !== jumpPeakX) {
                    direction = targetX > jumpPeakX ? 1 : -1;
                }
                if (stateTime >= travelDuration) {
                    fallingToDropTarget = false;
                    setPhase(Math.random() < 0.25 ? "eating" : "idle");
                }
            } else if (phase === "idle" && stateTime >= idleDuration) {
                setPhase("walking");
            } else if (phase === "eating") {
                if (frameTime >= eatFrameDuration) {
                    eatFrameIndex = 1 - eatFrameIndex;
                    sitePet.src = eatFrames[eatFrameIndex];
                    frameTime %= eatFrameDuration;
                }
                if (stateTime >= eatDuration) {
                    setPhase("walking");
                }
            }

            sitePet.style.left = `${petX}px`;
            sitePet.style.top = `${petY}px`;
            sitePet.style.transform = `scaleX(${direction === 1 ? -1 : 1})`;
            syncCarriedPets(sitePet);
        }

        previousTime = time;
        requestAnimationFrame(animatePet);
    }

    sitePet.addEventListener("pointerdown", (event) => {
        if (!animationStarted) return;
        event.preventDefault();
        delete sitePet.dataset.stackRoot;
        delete sitePet.dataset.stackLevel;
        sitePet.classList.remove("is-stacked");
        isDragging = true;
        dragOffsetX = event.clientX - petX;
        dragOffsetY = event.clientY - petY;
        dragStartY = event.clientY;
        sitePet.classList.add("is-dragging");
        sitePet.setPointerCapture(event.pointerId);
    });

    sitePet.addEventListener("pointermove", (event) => {
        if (!isDragging) return;

        const nextX = clamp(event.clientX - dragOffsetX, 0, window.innerWidth - petSize);
        if (nextX !== petX) {
            direction = nextX > petX ? 1 : -1;
        }
        petX = nextX;
        petY = clamp(event.clientY - dragOffsetY, 0, window.innerHeight - petSize);
        sitePet.style.left = `${petX}px`;
        sitePet.style.top = `${petY}px`;
        sitePet.style.transform = `scaleX(${direction === 1 ? -1 : 1})`;
        syncCarriedPets(sitePet);
    });

    function finishPetDrag(event) {
        if (!isDragging) return;
        isDragging = false;
        sitePet.classList.remove("is-dragging");
        if (sitePet.hasPointerCapture(event.pointerId)) {
            sitePet.releasePointerCapture(event.pointerId);
        }

        const droppedBounds = sitePet.getBoundingClientRect();
        const supportingPet = [...document.querySelectorAll(".site-pet.is-active")]
            .filter((pet) => pet !== sitePet)
            .find((pet) => {
                const bounds = pet.getBoundingClientRect();
                return droppedBounds.left < bounds.right &&
                    droppedBounds.right > bounds.left &&
                    droppedBounds.top < bounds.bottom &&
                    droppedBounds.bottom > bounds.top;
            });
        if (supportingPet) {
            stackPetOn(sitePet, supportingPet);
            setPhase("idle");
            previousTime = undefined;
            return;
        }

        delete sitePet.dataset.stackRoot;
        delete sitePet.dataset.stackLevel;
        sitePet.classList.remove("is-stacked");
        const droppedX = petX;
        const droppedY = petY;
        const draggedDown = event.clientY > dragStartY;
        let nearestDistance = Infinity;
        let nearestX = droppedX;
        let nearestY = window.innerHeight - petSize;
        currentSquare = -1;
        squares.forEach((square, index) => {
            const bounds = square.getBoundingClientRect();
            if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;

            const candidateX = clamp(droppedX, bounds.left, bounds.right - petSize);
            const candidateY = clamp(bounds.top - petSize, 0, window.innerHeight - petSize);
            if (draggedDown && candidateY < droppedY) return;
            const distance = Math.hypot(candidateX - droppedX, candidateY - droppedY);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                currentSquare = index;
                nearestX = candidateX;
                nearestY = candidateY;
            }
        });
        const floorY = window.innerHeight - petSize;
        if (!draggedDown || floorY >= droppedY) {
            const floorDistance = Math.abs(floorY - droppedY);
            if (floorDistance < nearestDistance) {
                nearestDistance = floorDistance;
                currentSquare = squares.length;
                nearestX = clamp(droppedX, 0, window.innerWidth - petSize);
                nearestY = floorY;
            }
        }

        if (nearestDistance < Infinity) {
            petX = droppedX;
            petY = droppedY;
            targetX = nearestX;
            targetY = nearestY;
            direction = targetX >= petX ? 1 : -1;
            fallingToDropTarget = true;
            setPhase("falling");
        }
        previousTime = undefined;
        sitePet.style.top = `${petY}px`;
    }

    sitePet.addEventListener("pointerup", finishPetDrag);
    sitePet.addEventListener("pointercancel", finishPetDrag);

    startPetRoaming = () => {
        if (animationStarted) return;
        animationStarted = true;

        const videoBounds = overlay.getBoundingClientRect();
        petX = clamp(
            videoBounds.left + (videoBounds.width - petSize) / 2,
            0,
            window.innerWidth - petSize
        );
        petY = clamp(
            videoBounds.top + (videoBounds.height - petSize) / 2,
            0,
            window.innerHeight - petSize
        );
        sitePet.style.left = `${petX}px`;
        sitePet.style.top = `${petY}px`;
        sitePet.classList.add("is-active");
        previousTime = undefined;
        requestAnimationFrame(animatePet);
    };

    spawnAnotherPet = () => {
        const pet = sitePet.cloneNode();
        pet.id = `shimeji-pet-${nextPetId++}`;
        const squares = [...document.querySelectorAll(".square")];
        const size = 80;
        const walkingFrames = ["shimeji/shime2.png", "shimeji/shime3.png"];
        const idleFrames = ["shimeji/shime1.png", "shimeji/shime20.png"];
        const eatingFrames = ["shimeji eat/shime15.png", "shimeji eat/shime16.png"];
        const videoBounds = overlay.getBoundingClientRect();
        let x = clamp(videoBounds.left + (videoBounds.width - size) / 2, 0, window.innerWidth - size);
        let y = clamp(videoBounds.top + (videoBounds.height - size) / 2, 0, window.innerHeight - size);
        let direction = 1;
        let platformIndex = squares.length;
        let phase = "falling";
        let phaseTime = 0;
        let frameTime = 0;
        let walkFrame = 0;
        let eatFrame = 0;
        let fromX = x;
        let fromY = y;
        let targetX = x;
        let targetY = window.innerHeight - size;
        let peakY = y;
        let travelTime = Math.max(400, (targetY - y) / 240 * 1000);
        let previousTime;
        let dragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let dragStartY = 0;

        pet.classList.add("is-active");
        pet.setAttribute("aria-label", "A small cat wandering around the page");
        pet.style.left = `${x}px`;
        pet.style.top = `${y}px`;
        pet.style.zIndex = `${4 + document.querySelectorAll(".site-pet.is-active").length}`;
        pet.src = "shimeji jump and fall/shime10.png";
        pet.draggable = false;
        document.body.append(pet);

        function updatePlatformPosition() {
            if (platformIndex === squares.length) {
                y = window.innerHeight - size;
                return;
            }
            const platform = squares[platformIndex]?.getBoundingClientRect();
            if (!platform || platform.bottom <= 0 || platform.top >= window.innerHeight) {
                platformIndex = squares.length;
                y = window.innerHeight - size;
                return;
            }
            x = clamp(x, platform.left, platform.right - size);
            y = clamp(platform.top - size, 0, window.innerHeight - size);
        }

        function chooseNextPlatform() {
            for (let offset = 1; offset <= squares.length + 1; offset += 1) {
                const candidate = (platformIndex + offset) % (squares.length + 1);
                if (candidate === squares.length) {
                    platformIndex = candidate;
                    return { x: clamp(x, 0, window.innerWidth - size), y: window.innerHeight - size };
                }
                const bounds = squares[candidate].getBoundingClientRect();
                if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) continue;
                platformIndex = candidate;
                return {
                    x: clamp(x, bounds.left, bounds.right - size),
                    y: clamp(bounds.top - size, 0, window.innerHeight - size)
                };
            }
            return null;
        }

        function setPhase(nextPhase) {
            phase = nextPhase;
            phaseTime = 0;
            frameTime = 0;
            if (phase === "jumping") {
                pet.src = "shimeji jump and fall/shime9.png";
            } else if (phase === "falling") {
                pet.src = "shimeji jump and fall/shime10.png";
            } else if (phase === "idle") {
                pet.src = idleFrames[Math.floor(Math.random() * idleFrames.length)];
            } else if (phase === "eating") {
                eatFrame = 0;
                pet.src = eatingFrames[eatFrame];
            } else {
                pet.src = walkingFrames[walkFrame];
            }
        }

        function startJump() {
            const target = chooseNextPlatform();
            if (!target) return false;
            fromX = x;
            fromY = y;
            targetX = target.x;
            targetY = target.y;
            peakY = Math.max(0, Math.min(fromY, targetY) - 55);
            direction = targetX >= fromX ? 1 : -1;
            travelTime = Math.max(400, Math.hypot(targetX - fromX, peakY - fromY) / 300 * 1000);
            setPhase("jumping");
            return true;
        }

        function animate(time) {
            if (previousTime !== undefined) {
                const delta = Math.min(time - previousTime, 50);
                if (!dragging) {
                        if (pet.dataset.stackRoot) {
                            const root = document.getElementById(pet.dataset.stackRoot);
                            if (root) syncCarriedPets(root);
                            previousTime = time;
                            requestAnimationFrame(animate);
                            return;
                        }
                        phaseTime += delta;
                    frameTime += delta;
                    if (phase === "walking") {
                        updatePlatformPosition();
                        const limits = platformIndex === squares.length
                            ? { left: 0, right: window.innerWidth }
                            : squares[platformIndex].getBoundingClientRect();
                        const minX = Math.max(0, limits.left);
                        const maxX = Math.max(minX, Math.min(window.innerWidth - size, limits.right - size));
                        x = clamp(x + direction * delta * 0.08, minX, maxX);
                        if (x === minX || x === maxX) direction *= -1;
                        if (frameTime >= 180) {
                            walkFrame = 1 - walkFrame;
                            pet.src = walkingFrames[walkFrame];
                            frameTime %= 180;
                        }
                        if (phaseTime >= 6000 && !hasCarriedPets(pet)) startJump();
                    } else if (phase === "jumping") {
                        const progress = Math.min(phaseTime / travelTime, 1);
                        x = fromX + (targetX - fromX) * progress;
                        y = fromY + (peakY - fromY) * progress;
                        if (phaseTime >= travelTime) {
                            fromX = x;
                            fromY = y;
                            travelTime = Math.max(400, Math.hypot(targetX - x, targetY - y) / 240 * 1000);
                            setPhase("falling");
                        }
                    } else if (phase === "falling") {
                        const progress = Math.min(phaseTime / travelTime, 1);
                        x = fromX + (targetX - fromX) * progress;
                        y = fromY + (targetY - fromY) * progress;
                        if (phaseTime >= travelTime) {
                            setPhase(Math.random() < 0.25 ? "eating" : "idle");
                        }
                    } else if (phase === "idle") {
                        updatePlatformPosition();
                        if (phaseTime >= 700) setPhase("walking");
                    } else if (phase === "eating") {
                        updatePlatformPosition();
                        if (frameTime >= 250) {
                            eatFrame = 1 - eatFrame;
                            pet.src = eatingFrames[eatFrame];
                            frameTime %= 250;
                        }
                        if (phaseTime >= 2400) setPhase("walking");
                    }
                }
                pet.style.left = `${x}px`;
                pet.style.top = `${y}px`;
                pet.style.transform = `scaleX(${direction === 1 ? -1 : 1})`;
                syncCarriedPets(pet);
            }
            previousTime = time;
            requestAnimationFrame(animate);
        }

        pet.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            delete pet.dataset.stackRoot;
            delete pet.dataset.stackLevel;
            pet.classList.remove("is-stacked");
            dragging = true;
            dragOffsetX = event.clientX - x;
            dragOffsetY = event.clientY - y;
            dragStartY = event.clientY;
            pet.setPointerCapture(event.pointerId);
        });
        pet.addEventListener("pointermove", (event) => {
            if (!dragging) return;
            const nextX = clamp(event.clientX - dragOffsetX, 0, window.innerWidth - size);
            if (nextX !== x) direction = nextX > x ? 1 : -1;
            x = nextX;
            y = clamp(event.clientY - dragOffsetY, 0, window.innerHeight - size);
            syncCarriedPets(pet);
        });
        function finishDrag(event) {
            if (!dragging) return;
            dragging = false;
            if (pet.hasPointerCapture(event.pointerId)) pet.releasePointerCapture(event.pointerId);

            const droppedBounds = pet.getBoundingClientRect();
            const supportingPet = [...document.querySelectorAll(".site-pet.is-active")]
                .filter((otherPet) => otherPet !== pet)
                .find((otherPet) => {
                    const bounds = otherPet.getBoundingClientRect();
                    return droppedBounds.left < bounds.right &&
                        droppedBounds.right > bounds.left &&
                        droppedBounds.top < bounds.bottom &&
                        droppedBounds.bottom > bounds.top;
                });
            if (supportingPet) {
                stackPetOn(pet, supportingPet);
                setPhase("idle");
                previousTime = undefined;
                return;
            }

            delete pet.dataset.stackRoot;
            delete pet.dataset.stackLevel;
            pet.classList.remove("is-stacked");
            const draggedDown = event.clientY > dragStartY;
            let nearest = { index: squares.length, x: clamp(x, 0, window.innerWidth - size), y: window.innerHeight - size };
            let distance = draggedDown && nearest.y < y ? Infinity : Math.abs(nearest.y - y);
            squares.forEach((square, index) => {
                const bounds = square.getBoundingClientRect();
                if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
                const candidateY = clamp(bounds.top - size, 0, window.innerHeight - size);
                if (draggedDown && candidateY < y) return;
                const candidateX = clamp(x, bounds.left, bounds.right - size);
                const candidateDistance = Math.hypot(candidateX - x, candidateY - y);
                if (candidateDistance < distance) {
                    nearest = { index, x: candidateX, y: candidateY };
                    distance = candidateDistance;
                }
            });
            platformIndex = nearest.index;
            fromX = x;
            fromY = y;
            targetX = nearest.x;
            targetY = nearest.y;
            travelTime = Math.max(400, Math.hypot(targetX - fromX, targetY - fromY) / 240 * 1000);
            direction = targetX >= fromX ? 1 : -1;
            setPhase("falling");
            previousTime = undefined;
        }

        pet.addEventListener("pointerup", finishDrag);
        pet.addEventListener("pointercancel", finishDrag);
        requestAnimationFrame(animate);
    };
}

function startVideoPlayback() {
    const wasPlaying = !video.paused && !video.ended;
    if (hasVideoFinishedOnce && wasPlaying) {
        spawnAnotherPet();
        video.currentTime = 0;
    }
    if (video.ended) {
        video.currentTime = 0;
    }
    if (video.paused) {
        video.play().catch(() => {
            console.warn("Playback requires a user click.");
        });
    }
}

overlay.addEventListener("click", startVideoPlayback);

video.addEventListener("ended", () => {
    if (!hasVideoFinishedOnce) {
        hasVideoFinishedOnce = true;
        startPetRoaming();
        return;
    }
    spawnAnotherPet();
});

video.addEventListener("error", () => {
    console.error("Unable to load the overlay video.", video.error);
});

function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
    canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
}

new ResizeObserver(resizeCanvas).observe(canvas);
resizeCanvas();

function drawKeyedVideo() {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth && video.videoHeight) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        const scale = Math.min(
            canvas.width / video.videoWidth,
            canvas.height / video.videoHeight
        );
        const width = video.videoWidth * scale;
        const height = video.videoHeight * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        context.drawImage(video, x, y, width, height);

        const frame = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = frame.data;
        for (let i = 0; i < pixels.length; i += 4) {
            const greenExcess = pixels[i + 1] - Math.max(pixels[i], pixels[i + 2]);
            if (greenExcess > 80) {
                pixels[i + 3] = 0;
            } else if (greenExcess > 30) {
                pixels[i + 3] = Math.round(pixels[i + 3] * (80 - greenExcess) / 50);
            }
        }
        context.putImageData(frame, 0, 0);
    }

    requestAnimationFrame(drawKeyedVideo);
}

drawKeyedVideo();