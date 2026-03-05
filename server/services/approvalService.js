const config = require('../config');

/**
 * Approval Service
 * Enforces the MES hierarchy chain: JE → AGE → GE → CWE → CE
 */
class ApprovalService {
    constructor() {
        this.chain = config.approvalChain; // ['JE', 'AGE', 'GE', 'CWE', 'CE']
    }

    getNextApprover(currentRole) {
        const idx = this.chain.indexOf(currentRole);
        if (idx === -1 || idx >= this.chain.length - 1) return null;
        return this.chain[idx + 1];
    }

    canApprove(userRole, existingApprovals) {
        const approvedRoles = existingApprovals
            .filter(a => a.status === 'approved')
            .map(a => a.role);

        const roleIdx = this.chain.indexOf(userRole);
        if (roleIdx === -1) return false;
        if (roleIdx === 0) return true; // JE can always start

        // Check all previous roles in chain have approved
        for (let i = 0; i < roleIdx; i++) {
            if (!approvedRoles.includes(this.chain[i])) return false;
        }
        return true;
    }

    isFullyApproved(approvals) {
        const approvedRoles = approvals
            .filter(a => a.status === 'approved')
            .map(a => a.role);
        return this.chain.every(role => approvedRoles.includes(role));
    }

    getApprovalStatus(approvals) {
        const approvedRoles = approvals
            .filter(a => a.status === 'approved')
            .map(a => a.role);

        for (let i = 0; i < this.chain.length; i++) {
            if (!approvedRoles.includes(this.chain[i])) {
                return {
                    currentStep: i,
                    currentRole: this.chain[i],
                    isComplete: false,
                    progress: Math.round((i / this.chain.length) * 100)
                };
            }
        }
        return { currentStep: this.chain.length, currentRole: null, isComplete: true, progress: 100 };
    }
}

module.exports = new ApprovalService();
