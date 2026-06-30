export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://docterdevserver-1-0.onrender.com';
// export const API_BASE_URL = 'http://localhost:8080' ;


export const endpoints = {
    auth: {
        login: '/api/v1/public/login',
        signup: '/api/v1/public/signup',
        sendOtp: '/api/v1/public/send-otp',
        verify: '/api/v1/public/verify',
        forgotPassword: '/api/v1/public/forgot-password',
        runtime: '/api/v1/public/app/runtime',
        refresh: '/api/v1/public/auth/refresh',
        logout: '/api/v1/public/auth/logout',
    },
    doctor: {
        profile: '/api/v1/doctors/profile',
        list: '/api/v1/admin',
        update: '/api/v1/doctors',
        changePassword: '/api/v1/users/change-password',
        updateEmail: '/api/v1/users/update-email',
        updateProfilePicture: '/api/v1/users/profile/picture',
        updateCoverPicture: '/api/v1/users/cover/picture',
        statistics: '/api/v1/doctor/statistics',
        delete: (id: string) => `/api/v1/admin/${id}`,
        card: {
            generateAndSend: '/api/v1/doctor/card/generate-and-send',
        }
    },
    appointments: {
        book: '/api/v1/appointments/book',
        search: '/api/v1/appointments/search',
        today: '/api/v1/appointments/by-doctor',
        listByDate: '/api/v1/appointments/by-doctor',
        getById: (id: string) => `/api/v1/appointments/${id}`,
        details: (id: string) => `/api/v1/appointments/details/${id}`,
        update: (id: string) => `/api/v1/appointments/update/${id}`,
        cancel: (id: string) => `/api/v1/appointments/cancel/${id}`,
        emergency: (id: string) => `/api/v1/appointments/emergency/${id}`,
    },
    collaborators: {
        list: '/api/v1/doctors/collaborators',
        invite: '/api/v1/doctors/invitations',
        invitations: '/api/v1/doctors/invitations',
        accept: '/api/v1/public/invitations/accept',
        profile: '/api/v1/collaborators/profile',
        updateProfile: '/api/v1/collaborators/profile',
        revoke: (id: string) => `/api/v1/doctors/invitations/${id}`,
        remove: (id: string) => `/api/v1/doctors/collaborators/${id}`,
        activate: (id: string) => `/api/v1/doctors/collaborators/${id}/activate`,
        deactivate: (id: string) => `/api/v1/doctors/collaborators/${id}/deactivate`,
        associatedDoctors: '/api/v1/collaborators/doctors',
        switchDoctor: (id: string) => `/api/v1/collaborators/active-doctor/${id}`,
        activeDoctorProfile: '/api/v1/collaborators/active-doctor/profile',
    },
    reports: {
        doctor: (fromDate: string, toDate?: string) => {
            let url = `/api/v1/reports/doctor?fromDate=${fromDate}`;
            if (toDate) url += `&toDate=${toDate}`;
            return url;
        },
    },
    notifications: {
        getAll: '/api/v1/notification',
        getUnread: '/api/v1/notification/unread',
        markRead: (id: string) => `/api/v1/notification/${id}/read`,
        markAllRead: '/api/v1/notification/read-all',
    },
    support: {
        createTicket: '/api/v1/support/tickets',
        getAllTickets: '/api/v1/support/tickets',
        getTicket: (id: string) => `/api/v1/support/tickets/${id}`,
        getByStatus: (status: string) => `/api/v1/support/tickets?status=${status}`,
    },
    entities: {
        create: '/api/v1/entities',
        get: (entityId: string) => `/api/v1/entities/${entityId}`,
        update: (entityId: string) => `/api/v1/entities/${entityId}`,
        search: '/api/v1/entities/search',
        members: (entityId: string) => `/api/v1/entities/${entityId}/members`,
        addMember: (entityId: string) => `/api/v1/entities/${entityId}/members`,
        updateMemberRole: (entityId: string, userId: string) => `/api/v1/entities/${entityId}/members/${userId}`,
        removeMember: (entityId: string, userId: string) => `/api/v1/entities/${entityId}/members/${userId}`,
    },
    affiliations: {
        initiate: '/api/v1/affiliations',
        list: '/api/v1/affiliations',
        get: (id: string) => `/api/v1/affiliations/${id}`,
        accept: (id: string) => `/api/v1/affiliations/${id}/accept`,
        reject: (id: string) => `/api/v1/affiliations/${id}/reject`,
        suspend: (id: string) => `/api/v1/affiliations/${id}/suspend`,
        terminate: (id: string) => `/api/v1/affiliations/${id}/terminate`,
        availability: (id: string) => `/api/v1/affiliations/${id}/availability`,
        conflictCheck: (id: string) => `/api/v1/affiliations/${id}/availability/conflicts`,
        dataSharing: (id: string) => `/api/v1/affiliations/${id}/data-sharing`,
        staff: (id: string) => `/api/v1/affiliations/${id}/staff`,
        revokeStaff: (id: string, userId: string) => `/api/v1/affiliations/${id}/staff/${userId}`,
    },
    contexts: {
        list: '/api/v1/contexts',
        setActive: '/api/v1/contexts/active',
    },
    adminAffiliations: {
        approve: (id: string) => `/api/v1/admin/affiliations/${id}/approve`,
        reject: (id: string) => `/api/v1/admin/affiliations/${id}/reject`,
        reinstate: (id: string) => `/api/v1/admin/affiliations/${id}/reinstate`,
    },
} as const;
