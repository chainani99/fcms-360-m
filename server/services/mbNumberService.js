const config = require('../config');

/**
 * MB Number Generator
 * Format: FORMATION/YEAR/CONTRACT_ID/MB_SEQUENCE
 * Example: CE-SC/2026/CONTRACT024/MB001
 */
class MBNumberService {
    constructor() {
        // Track sequences per contract
        this.sequences = {};
    }

    generate(formation, contractId) {
        const year = new Date().getFullYear();
        const key = `${formation}/${year}/${contractId}`;

        if (!this.sequences[key]) {
            this.sequences[key] = 0;
        }

        this.sequences[key]++;
        const seq = String(this.sequences[key]).padStart(3, '0');

        return `${formation}/${year}/${contractId}/MB${seq}`;
    }

    setSequence(formation, year, contractId, seq) {
        const key = `${formation}/${year}/${contractId}`;
        this.sequences[key] = seq;
    }
}

module.exports = new MBNumberService();
