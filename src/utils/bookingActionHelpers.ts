import { Appointment } from "@/store/slices/appointmentSlice";

export interface ActionValidation {
    allowed: boolean;
    message?: string;
    needsConfirmation?: boolean;
}

// Helper functions for action validation
export const canMarkAvailable = (appointment: Appointment): ActionValidation => {
    if (appointment.status !== "ACCEPTED" && appointment.status !== "REACTIVATED") {
        return { allowed: false, message: "Only ACCEPTED or REACTIVATED appointments can be marked available" };
    }
    return { allowed: true };
};

export const canMarkUnavailable = (appointment: Appointment): ActionValidation => {
    if (appointment.status !== "ACCEPTED" && appointment.status !== "REACTIVATED") {
        return { allowed: false, message: "Only ACCEPTED or REACTIVATED appointments can be marked unavailable" };
    }
    if (appointment.treated) {
        return { allowed: false, message: "Treated appointments cannot be marked unavailable" };
    }
    return { allowed: true, needsConfirmation: true };
};

export const canMarkPaid = (appointment: Appointment): ActionValidation => {
    if (appointment.status !== "ACCEPTED" && appointment.status !== "REACTIVATED") {
        return { allowed: false, message: "Only ACCEPTED or REACTIVATED appointments can be marked paid" };
    }
    return { allowed: true };
};

export const canMarkUnpaid = (appointment: Appointment): ActionValidation => {
    if (appointment.status !== "ACCEPTED" && appointment.status !== "REACTIVATED") {
        return { allowed: false, message: "Only ACCEPTED or REACTIVATED appointments can be marked unpaid" };
    }
    return { allowed: true, needsConfirmation: true };
};

export const canMarkTreated = (appointment: Appointment): ActionValidation => {
    if (appointment.status !== "ACCEPTED" && appointment.status !== "REACTIVATED") {
        return { allowed: false, message: "Only ACCEPTED or REACTIVATED appointments can be marked treated" };
    }
    return { allowed: true };
};

export const canMarkUntreated = (appointment: Appointment): ActionValidation => {
    if (appointment.status !== "ACCEPTED" && appointment.status !== "REACTIVATED") {
        return { allowed: false, message: "Only ACCEPTED or REACTIVATED appointments can be unmarked as treated" };
    }
    return { allowed: true, needsConfirmation: true };
};

export const canCancel = (appointment: Appointment): ActionValidation => {
    if (appointment.status === "CANCELLED") {
        return { allowed: false, message: "Appointment is already cancelled" };
    }
    if (appointment.status === "MISSED") {
        return { allowed: false, message: "Missed appointments cannot be cancelled" };
    }
    if (appointment.treated) {
        return { allowed: false, message: "Treated appointments cannot be cancelled" };
    }
    if (appointment.paymentStatus) {
        return { allowed: false, message: "Cannot cancel appointment with payment already received" };
    }
    return { allowed: true, needsConfirmation: true };
};

export const canEdit = (appointment: Appointment): ActionValidation => {
    if (appointment.status === "CANCELLED" || appointment.status === "MISSED") {
        return { allowed: false, message: "Cancelled or missed appointments cannot be edited" };
    }
    if (appointment.treated) {
        return { allowed: false, message: "Treated appointments cannot be edited" };
    }
    return { allowed: true, needsConfirmation: true };
};

export const canMarkEmergency = (appointment: Appointment): ActionValidation => {
    if (appointment.status !== "ACCEPTED" && appointment.status !== "REACTIVATED") {
        return { allowed: false, message: "Only ACCEPTED or REACTIVATED appointments can be marked as emergency" };
    }
    return { allowed: true, needsConfirmation: true };
};

export const canReactivate = (appointment: Appointment): ActionValidation => {
    if (appointment.status !== "CANCELLED" && appointment.status !== "MISSED") {
        return { allowed: false, message: "Only cancelled or missed appointments can be reactivated" };
    }
    return { allowed: true, needsConfirmation: true };
};

const compareStatus = (a: Appointment["status"], b: Appointment["status"]): number => {
    const priority: Record<Appointment["status"], number> = {
        REACTIVATED: 1,
        ACCEPTED: 2,
        BOOKED: 3,
        MISSED: 4,
        CANCELLED: 5,
    };
    return (priority[a] || 99) - (priority[b] || 99);
};

const getTimeGroup = (appointmentDateTime: string, currentTime: Date): number => {
    const apptTime = new Date(appointmentDateTime).getTime();
    const current = currentTime.getTime();
    const isOverdue = current > apptTime;
    const timeDiff = apptTime - current;
    const isCurrent = !isOverdue && timeDiff <= 5 * 60 * 1000;

    return isOverdue ? 1 : isCurrent ? 2 : 3;
};

export const sortAppointments = (appointments: Appointment[]): Appointment[] => {
    const currentTime = new Date();

    return [...appointments].sort((a, b) => {
        if (a.treated !== b.treated) {
            return a.treated ? 1 : -1;
        }

        if (a.isEmergency !== b.isEmergency) {
            return b.isEmergency ? 1 : -1;
        }

        const statusCompare = compareStatus(a.status, b.status);
        if (statusCompare !== 0) return statusCompare;

        const aGroup = getTimeGroup(a.appointmentDateTime, currentTime);
        const bGroup = getTimeGroup(b.appointmentDateTime, currentTime);

        if (aGroup !== bGroup) {
            return aGroup - bGroup;
        }

        // Sort logic for availableAtClinic is simplified here as we might not have all fields in the new type yet
        // Defaulting to basic date sort if complexity is high

        return new Date(a.appointmentDateTime).getTime() - new Date(b.appointmentDateTime).getTime();
    });
};
