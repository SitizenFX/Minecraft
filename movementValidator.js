// movementValidator.js
// MIT License (c) 2025 Elijah Siita / VidllQ Authority
// Validates player movements based on max speed

class MovementValidator {
    /**
     * @param {number} maxSpeed Maximum allowed speed in units per second
     */
    constructor(maxSpeed = 10) {
        this.maxSpeed = maxSpeed;
    }

    /**
     * Validate movement between two samples
     * @param {Object} prev { x, y, z, t }
     * @param {Object} curr { x, y, z, t }
     * @returns {null|Object} null if OK, violation object if exceeded
     */
    validate(prev, curr) {
        const dt = curr.t - prev.t;
        if (dt <= 0) {
            return {
                speed: Infinity,
                maxAllowed: this.maxSpeed,
                prev,
                curr,
                reason: "non-positive delta time"
            };
        }

        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const dz = curr.z - prev.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const speed = dist / dt;

        if (speed > this.maxSpeed) {
            return {
                speed,
                maxAllowed: this.maxSpeed,
                prev,
                curr,
                reason: "exceeds max speed"
            };
        }

        return null;
    }
}

module.exports = MovementValidator;
