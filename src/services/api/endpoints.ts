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
    }
} as const;
