const { v4: uuidv4 } = require('uuid');

// Demo data for FCMS-360
const users = [
    {
        user_id: '11111111-1111-1111-1111-111111111111',
        name: 'Rajesh Kumar',
        email: 'rajesh@mes.gov.in',
        phone: '9876543210',
        password_hash: '$2a$10$dummy',
        role: 'GE',
        formation: 'CE-SC',
        appointment: 'Garrison Engineer',
        is_active: true
    },
    {
        user_id: '22222222-2222-2222-2222-222222222222',
        name: 'Jr. Eng. A.Kumar',
        email: 'akumar@mes.gov.in',
        phone: '9876543211',
        password_hash: '$2a$10$dummy',
        role: 'JE',
        formation: 'CE-SC',
        appointment: 'Junior Engineer',
        is_active: true
    },
    {
        user_id: '33333333-3333-3333-3333-333333333333',
        name: 'Col. R.Singh',
        email: 'rsingh@mes.gov.in',
        phone: '9876543212',
        password_hash: '$2a$10$dummy',
        role: 'CWE',
        formation: 'CE-SC',
        appointment: 'Commander Works Engineer',
        is_active: true
    },
    {
        user_id: '44444444-4444-4444-4444-444444444444',
        name: 'Suresh Reddy',
        email: 'sreddy@mes.gov.in',
        phone: '9876543213',
        password_hash: '$2a$10$dummy',
        role: 'AGE',
        formation: 'CE-SC',
        appointment: 'Asst. Garrison Engineer',
        is_active: true
    },
    {
        user_id: '55555555-5555-5555-5555-555555555555',
        name: 'Brig. M.Patel',
        email: 'mpatel@mes.gov.in',
        phone: '9876543214',
        password_hash: '$2a$10$dummy',
        role: 'CE',
        formation: 'CE-SC',
        appointment: 'Chief Engineer',
        is_active: true
    }
];

const projects = [
    {
        project_id: 'aaaa1111-1111-1111-1111-111111111111',
        project_name: 'P1(Eastern command office Building)',
        location: 'Vishakapatnam, Madurawada, Andhrapradesh',
        latitude: 17.3850,
        longitude: 78.4867,
        client_name: 'Indian Army - Eastern Command',
        work_order_value: 4200000000,
        contractor: 'Suresh Reddy',
        sub_contractors: ['National Engineering', 'Apex Infra Pvt Ltd'],
        start_date: '2025-09-01',
        end_date: '2026-06-30',
        code_head: 'CWF 208',
        facade_type: 'ACP',
        total_area_sqft: 25000,
        design_consultant: 'Morphogenesis Architects',
        budget_allocation: 4000000000,
        budget_utilized: 3000000000,
        budget_withdrawn: 0,
        status: 'requires_attention',
        progress: 90,
        formation: 'CE-SC',
        assigned_to: '11111111-1111-1111-1111-111111111111',
        assigned_engineer: '22222222-2222-2222-2222-222222222222',
        milestone: 'Structure complete',
        category: 'critical_issues',
        created_at: '2025-09-01T00:00:00Z'
    },
    {
        project_id: 'aaaa2222-2222-2222-2222-222222222222',
        project_name: 'P5(Barracks Construction)',
        location: 'Mumbai, Maharashtra',
        latitude: 19.076,
        longitude: 72.8777,
        client_name: 'Indian Army - Western Command',
        work_order_value: 2800000000,
        contractor: 'Krishna sharma',
        sub_contractors: [],
        start_date: '2025-06-15',
        end_date: '2026-03-31',
        code_head: 'CWF 310',
        facade_type: 'Glass',
        total_area_sqft: 18000,
        design_consultant: 'Studio Symbiosis',
        budget_allocation: 2500000000,
        budget_utilized: 1800000000,
        budget_withdrawn: 0,
        status: 'on_track',
        progress: 80,
        formation: 'CE-SC',
        assigned_to: '11111111-1111-1111-1111-111111111111',
        assigned_engineer: '44444444-4444-4444-4444-444444444444',
        milestone: 'Building Partially',
        category: 'all_safe',
        created_at: '2025-06-15T00:00:00Z'
    },
    {
        project_id: 'aaaa3333-3333-3333-3333-333333333333',
        project_name: 'P3(Road Development)',
        location: 'Delhi, DL',
        latitude: 28.6139,
        longitude: 77.2090,
        client_name: 'MES Directorate',
        work_order_value: 1600000000,
        contractor: 'Ava loggers',
        sub_contractors: ['KR Builders'],
        start_date: '2025-08-01',
        end_date: '2026-05-15',
        code_head: 'CWF 115',
        facade_type: 'Stone',
        total_area_sqft: 12000,
        design_consultant: 'RSP Design',
        budget_allocation: 1500000000,
        budget_utilized: 900000000,
        budget_withdrawn: 100000000,
        status: 'delayed',
        progress: 60,
        formation: 'CE-SC',
        assigned_to: '22222222-2222-2222-2222-222222222222',
        assigned_engineer: '22222222-2222-2222-2222-222222222222',
        milestone: 'Foundation & Earthwork',
        category: 'weather_risk',
        created_at: '2025-08-01T00:00:00Z'
    }
];

const milestones = [
    // P1 milestones
    {
        milestone_id: 'ms-0001', project_id: 'aaaa1111-1111-1111-1111-111111111111', title: 'Order Received', code_head: 'CWF 208', start_date: '2025-09-01', end_date: '2025-09-15', status: 'completed', sub_milestones: [
            { title: 'Vendor Selection', start_date: '2025-09-01', end_date: '2025-09-07', status: 'completed' },
            { title: 'Order Verification', start_date: '2025-09-08', end_date: '2025-09-15', status: 'completed' }
        ]
    },
    { milestone_id: 'ms-0002', project_id: 'aaaa1111-1111-1111-1111-111111111111', title: 'Contract Review & Kick-Off', code_head: 'CWF 208', start_date: '2025-09-16', end_date: '2025-10-15', status: 'completed', sub_milestones: [] },
    { milestone_id: 'ms-0003', project_id: 'aaaa1111-1111-1111-1111-111111111111', title: 'Design Phase', code_head: 'CWF 208', start_date: '2025-10-16', end_date: '2025-12-31', status: 'completed', sub_milestones: [] },
    { milestone_id: 'ms-0004', project_id: 'aaaa1111-1111-1111-1111-111111111111', title: 'Procurement', code_head: 'CWF 208', start_date: '2026-01-01', end_date: '2026-02-28', status: 'in_progress', sub_milestones: [] },
    { milestone_id: 'ms-0005', project_id: 'aaaa1111-1111-1111-1111-111111111111', title: 'Fabrication', code_head: 'CWF 208', start_date: '2026-03-01', end_date: '2026-06-30', status: 'pending', sub_milestones: [] },
    // P5 milestones
    { milestone_id: 'ms-0006', project_id: 'aaaa2222-2222-2222-2222-222222222222', title: 'Order Received', code_head: 'CWF 310', start_date: '2025-06-15', end_date: '2025-06-30', status: 'completed', sub_milestones: [] },
    { milestone_id: 'ms-0007', project_id: 'aaaa2222-2222-2222-2222-222222222222', title: 'Design Phase', code_head: 'CWF 310', start_date: '2025-07-01', end_date: '2025-09-30', status: 'completed', sub_milestones: [] },
    { milestone_id: 'ms-0008', project_id: 'aaaa2222-2222-2222-2222-222222222222', title: 'Procurement', code_head: 'CWF 310', start_date: '2025-10-01', end_date: '2026-01-31', status: 'in_progress', sub_milestones: [] },
    // P3 milestones
    { milestone_id: 'ms-0009', project_id: 'aaaa3333-3333-3333-3333-333333333333', title: 'Order Received', code_head: 'CWF 115', start_date: '2025-08-01', end_date: '2025-08-15', status: 'completed', sub_milestones: [] },
    { milestone_id: 'ms-0010', project_id: 'aaaa3333-3333-3333-3333-333333333333', title: 'Foundation & Earthwork', code_head: 'CWF 115', start_date: '2025-08-16', end_date: '2026-01-31', status: 'in_progress', sub_milestones: [] },
];

const measurementBooks = [
    {
        mb_id: 'bbbb1111-1111-1111-1111-111111111111',
        mb_number: 'CE-SC/2026/CONTRACT024/MB001',
        project_id: 'aaaa1111-1111-1111-1111-111111111111',
        created_by: '22222222-2222-2222-2222-222222222222',
        status: 'submitted',
        is_locked: false,
        created_at: '2026-01-15T10:00:00Z'
    },
    {
        mb_id: 'bbbb2222-2222-2222-2222-222222222222',
        mb_number: 'CE-SC/2026/CONTRACT025/MB001',
        project_id: 'aaaa2222-2222-2222-2222-222222222222',
        created_by: '22222222-2222-2222-2222-222222222222',
        status: 'draft',
        is_locked: false,
        created_at: '2026-02-01T10:00:00Z'
    }
];

const measurements = [
    {
        measurement_id: 'cccc1111-1111-1111-1111-111111111111',
        mb_id: 'bbbb1111-1111-1111-1111-111111111111',
        work_item: 'RCC Foundation Work',
        quantity: 450.5,
        unit: 'cum',
        entered_by: '22222222-2222-2222-2222-222222222222',
        remarks: 'Foundation layer 1 completed',
        image_reference: null,
        geo_latitude: 17.3850,
        geo_longitude: 78.4867,
        geo_altitude: 542,
        geo_accuracy: 3,
        entered_date: '2026-01-15T10:30:00Z'
    }
];

const approvals = [
    {
        approval_id: 'dddd1111-1111-1111-1111-111111111111',
        mb_id: 'bbbb1111-1111-1111-1111-111111111111',
        measurement_id: 'cccc1111-1111-1111-1111-111111111111',
        approved_by: '22222222-2222-2222-2222-222222222222',
        role: 'JE',
        status: 'approved',
        remarks: 'Measurement verified on site',
        approval_date: '2026-01-15T11:00:00Z'
    }
];

const billingRecords = [
    {
        billing_id: 'eeee1111-1111-1111-1111-111111111111',
        bill_number: 'BILL-2024-1102',
        project_id: 'aaaa1111-1111-1111-1111-111111111111',
        contractor: 'National Engineering',
        amount: 2420000,
        status: 'overdue',
        due_date: '2026-02-28',
        paid_date: null,
        created_at: '2026-01-10T00:00:00Z'
    },
    {
        billing_id: 'eeee2222-2222-2222-2222-222222222222',
        bill_number: 'BILL-2024-3334',
        project_id: 'aaaa1111-1111-1111-1111-111111111111',
        contractor: 'Apex Infra Pvt Ltd',
        amount: 1220000,
        status: 'overdue',
        due_date: '2026-03-01',
        paid_date: null,
        created_at: '2026-01-15T00:00:00Z'
    },
    {
        billing_id: 'eeee3333-3333-3333-3333-333333333333',
        bill_number: 'BILL-2024-1234',
        project_id: 'aaaa1111-1111-1111-1111-111111111111',
        contractor: 'KR Builders',
        amount: 1010000,
        status: 'received',
        due_date: '2026-03-15',
        paid_date: null,
        created_at: '2026-02-01T00:00:00Z'
    },
    {
        billing_id: 'eeee4444-4444-4444-4444-444444444444',
        bill_number: 'BILL-2024-5678',
        project_id: 'aaaa2222-2222-2222-2222-222222222222',
        contractor: 'Krishna sharma',
        amount: 3500000,
        status: 'paid',
        due_date: '2026-02-15',
        paid_date: '2026-02-14',
        created_at: '2026-01-20T00:00:00Z'
    },
    {
        billing_id: 'eeee5555-5555-5555-5555-555555555555',
        bill_number: 'BILL-2024-9012',
        project_id: 'aaaa2222-2222-2222-2222-222222222222',
        contractor: 'Krishna sharma',
        amount: 1800000,
        status: 'pending_approval',
        due_date: '2026-03-10',
        paid_date: null,
        created_at: '2026-02-10T00:00:00Z'
    },
    {
        billing_id: 'eeee6666-6666-6666-6666-666666666666',
        bill_number: 'BILL-2024-3456',
        project_id: 'aaaa1111-1111-1111-1111-111111111111',
        contractor: 'National Engineering',
        amount: 2100000,
        status: 'received',
        due_date: '2026-03-20',
        paid_date: null,
        created_at: '2026-02-15T00:00:00Z'
    },
    {
        billing_id: 'eeee7777-7777-7777-7777-777777777777',
        bill_number: 'BILL-2024-7890',
        project_id: 'aaaa3333-3333-3333-3333-333333333333',
        contractor: 'Ava loggers',
        amount: 950000,
        status: 'received',
        due_date: '2026-03-25',
        paid_date: null,
        created_at: '2026-02-20T00:00:00Z'
    }
];

const messages = [];

module.exports = {
    users,
    projects,
    milestones,
    measurementBooks,
    measurements,
    approvals,
    billingRecords,
    messages
};
