export type EntityType = 'HOSPITAL' | 'CLINIC' | 'DIAGNOSTIC' | 'PHARMACY' | 'OTHER';
export type EntityStatus = 'DRAFT' | 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED' | 'TERMINATED' | 'DENIED';
export type AffiliationStatus = 'PENDING_PEER_ACCEPT' | 'PENDING_ADMIN_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'REJECTED';
export type AffiliationInitiator = 'DOCTOR' | 'ENTITY';
export type EntityMemberRole = 'ENTITY_ADMIN' | 'SUPERVISOR' | 'ENTITY_COLLABORATOR';
export type StaffAssignmentScope = 'DOCTOR_CONTEXT' | 'ENTITY_CONTEXT';
export type StaffAssigner = 'DOCTOR' | 'ENTITY';

export type AvailabilityEditMode = 'DIRECT' | 'PROPOSE';

export interface EntitySettings {
    timezone?: string;
    availabilityEditMode: AvailabilityEditMode;
    maxBookingsPerSlot?: number;
    includeGlobalAvailabilityInConflicts: boolean;
    emailNotificationsEnabled: boolean;
    pushNotificationsEnabled: boolean;
}

export interface EntityMember {
    userId: string;
    displayName?: string;
    email?: string;
    role: EntityMemberRole;
    permissions?: string[];
    departmentIds?: string[];
    joinedAt: string;
    active: boolean;
}

export interface HealthcareEntity {
    id: string;
    entityId: string;
    name: string;
    type: EntityType;
    status: EntityStatus;
    verificationStatus: VerificationStatus;
    registrationNumber?: string;
    licenseDocumentUrl?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phoneNumber?: string;
    email?: string;
    logoUrl?: string;
    departments?: string[];
    members?: EntityMember[];
    settings: EntitySettings;
    createdByUserId: string;
    createdAt: string;
    updatedAt: string;
}

export interface DataSharingPolicy {
    version: number;
    doctorSharedFields: string[];
    entitySharedFields: string[];
    featureFlags?: Record<string, boolean>;
    agreedAt?: string;
    agreedByDoctorUserId?: string;
    agreedByEntityUserId?: string;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

export interface DayAvailability {
    day: string;
    slots: TimeSlot[];
}

export interface EntityAffiliation {
    affiliationId: string;
    entityId: string;
    entityName: string;
    doctorId: string;
    doctorName: string;
    doctorSpecialization?: string;
    department?: string;
    initiatedBy: AffiliationInitiator;
    initiatedByUserId: string;
    status: AffiliationStatus;
    entityAvailability?: DayAvailability[];
    dataSharingPolicy?: DataSharingPolicy;
    peerAcceptedAt?: string;
    peerAcceptedByUserId?: string;
    adminApprovedAt?: string;
    adminApprovedByUserId?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    suspendedAt?: string;
    suspensionReason?: string;
    terminatedAt?: string;
    terminationReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AffiliationStaffAssignment {
    id: string;
    affiliationId: string;
    entityId: string;
    doctorId: string;
    userId: string;
    assignedBy: StaffAssigner;
    assignedByUserId: string;
    scope: StaffAssignmentScope;
    role: string;
    permissions?: string[];
    active: boolean;
    assignedAt: string;
    revokedAt?: string;
}

export interface UserContextOption {
    contextType: 'ENTITY' | 'AFFILIATION' | 'DOCTOR';
    contextId: string;
    displayName: string;
    entityId?: string;
    entityName?: string;
    affiliationId?: string;
    doctorId?: string;
    doctorName?: string;
    role?: string;
}

export interface ConflictDetail {
    day: string;
    startTime: string;
    endTime: string;
    conflictingAffiliationId: string;
    conflictingEntityName: string;
}

export interface ConflictCheckResult {
    hasConflicts: boolean;
    conflicts: ConflictDetail[];
}
