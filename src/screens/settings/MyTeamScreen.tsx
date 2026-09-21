import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, Animated, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, UserPlus, Users, Mail } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme/ThemeContext';
import { useDialog } from '@/context/DialogContext';
import { Text } from '@/components/ui/Text';
import { MeshBackground } from '@/components/ui/MeshBackground';
import { createStyles } from '@/styles/screens/MyTeamScreen.styles';
import teamService, { Collaborator, Invitation } from '@/services/teamService';
import { haptics } from '@/utils/haptics';

// Production Components
import { TeamMemberCard } from '@/components/settings/team/TeamMemberCard';
import { InvitationCard } from '@/components/settings/team/InvitationCard';
import { TeamSkeleton } from '@/components/settings/team/TeamSkeleton';
import { InviteMemberModal } from '@/components/settings/team/InviteMemberModal';

export default function MyTeamScreen() {
    const { theme } = useTheme();
    const { showDialog, hideDialog } = useDialog();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const handleBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)');
        }
    }, [router]);

    // State
    const [activeTab, setActiveTab] = useState<'collaborators' | 'invitations'>('collaborators');
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);

    // Animations
    const scrollY = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<any>(null);

    const fetchData = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const [collabData, inviteData] = await Promise.all([
                teamService.getCollaborators(),
                teamService.getInvitations()
            ]);
            setCollaborators(collabData);
            setInvitations(inviteData);
        } catch (error) {
            console.error("Failed to fetch team data:", error);
            showDialog({
                title: "Connection Issue",
                description: "Could not sync team data. Please try again.",
                variant: 'default',
                primaryAction: { label: 'OK', onPress: hideDialog }
            });
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [showDialog, hideDialog]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const onRefresh = () => {
        setRefreshing(true);
        haptics.impact();
        fetchData(true);
    };

    useFocusEffect(
        useCallback(() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
        }, [])
    );

    const handleInvite = async (email: string, role: string) => {
        try {
            await teamService.inviteCollaborator(email, role);
            haptics.impact();
            fetchData(true);
            showDialog({
                title: "Invitation Sent",
                description: `A request has been sent to ${email}.`,
                variant: 'success',
                primaryAction: { label: 'OK', onPress: hideDialog }
            });
        } catch (error) {
            haptics.error();
            showDialog({
                title: "Failed",
                description: "Could not send invitation. They might already be on the team.",
                variant: 'danger',
                primaryAction: { label: 'OK', onPress: hideDialog }
            });
        }
    };

    const handleRevoke = (id: string) => {
        showDialog({
            title: "Revoke Invitation",
            description: "Are you sure you want to cancel this invitation?",
            variant: 'danger',
            primaryAction: {
                label: "Revoke",
                onPress: async () => {
                    hideDialog();
                    try {
                        await teamService.revokeInvitation(id);
                        haptics.selection();
                        fetchData(true);
                    } catch (e) {
                        showDialog({
                            title: "Error",
                            description: "Failed to revoke invitation.",
                            variant: 'danger',
                            primaryAction: { label: 'OK', onPress: hideDialog }
                        });
                    }
                }
            },
            secondaryAction: {
                label: "Keep",
                onPress: hideDialog
            }
        });
    };

    const handleRemove = (id: string, name: string) => {
        showDialog({
            title: "Remove Collaborator",
            description: `Are you sure you want to remove ${name}? They will lose access immediately.`,
            variant: 'danger',
            primaryAction: {
                label: "Remove",
                onPress: async () => {
                    hideDialog();
                    try {
                        await teamService.removeCollaborator(id);
                        haptics.selection();
                        fetchData(true);
                    } catch (e) {
                        showDialog({
                            title: "Error",
                            description: "Failed to remove collaborator.",
                            variant: 'danger',
                            primaryAction: { label: 'OK', onPress: hideDialog }
                        });
                    }
                }
            },
            secondaryAction: {
                label: "Cancel",
                onPress: hideDialog
            }
        });
    };

    // Derived Counts
    const activeCount = useMemo(() =>
        (collaborators || []).filter(c =>
            (c.status?.toUpperCase() === 'ACTIVE' || c.status?.toUpperCase() === 'ACTIVATED')
        ).length,
        [collaborators]);

    const pendingCount = useMemo(() => (invitations || []).length, [invitations]);

    const renderItem = useCallback(({ item, index }: { item: any, index: number }) => {
        if (activeTab === 'collaborators') {
            return (
                <TeamMemberCard
                    item={item as Collaborator}
                    index={index}
                    theme={theme}
                    onAction={handleRemove}
                />
            );
        }
        return (
            <InvitationCard
                item={item as Invitation}
                index={index}
                theme={theme}
                onRevoke={handleRevoke}
            />
        );
    }, [activeTab, theme, handleRemove, handleRevoke]);

    const ListHeader = useMemo(() => (
        <View>
            {/* Stats Row */}
            <View style={styles.statsContainer}>
                <LinearGradient
                    colors={theme.mode === 'dark' ? ['#0ea5e920', '#0ea5e905'] : ['#e9f5ff', '#f8fafc']}
                    style={styles.statGradient}
                >
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Active</Text>
                        <Text style={styles.statValue}>{activeCount}</Text>
                    </View>
                </LinearGradient>
                <LinearGradient
                    colors={theme.mode === 'dark' ? ['#f59e0b20', '#f59e0b05'] : ['#fffbeb', '#f8fafc']}
                    style={styles.statGradient}
                >
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Pending</Text>
                        <Text style={styles.statValue}>{pendingCount}</Text>
                    </View>
                </LinearGradient>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'collaborators' && styles.activeTab]}
                    onPress={() => { haptics.selection(); setActiveTab('collaborators'); }}
                >
                    <Text style={[styles.tabText, activeTab === 'collaborators' && styles.activeTabText]}>Members</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'invitations' && styles.activeTab]}
                    onPress={() => { haptics.selection(); setActiveTab('invitations'); }}
                >
                    <Text style={[styles.tabText, activeTab === 'invitations' && styles.activeTabText]}>Invitations</Text>
                </TouchableOpacity>
            </View>
        </View>
    ), [styles, theme, activeTab, activeCount, pendingCount]);

    const EmptyState = useMemo(() => {
        if (isLoading) return <TeamSkeleton />;

        if (activeTab === 'collaborators') {
            return (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                        <Users size={40} color={theme.text.tertiary} />
                    </View>
                    <Text style={styles.emptyTitle}>No Team Members</Text>
                    <Text style={styles.emptyText}>Add colleagues to assist with managing your clinic.</Text>
                </View>
            );
        }
        return (
            <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                    <Mail size={40} color={theme.text.tertiary} />
                </View>
                <Text style={styles.emptyTitle}>No Pending Invites</Text>
                <Text style={styles.emptyText}>Invitations sent will appear here for management.</Text>
            </View>
        );
    }, [isLoading, activeTab, styles, theme]);

    const listData = activeTab === 'collaborators' ? collaborators : invitations;

    return (
        <View style={styles.container}>
            <MeshBackground theme={theme} scrollY={scrollY} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <ChevronLeft size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Team</Text>
                    <View style={{ width: 40 }} />
                </View>
            </View>

            <Animated.FlatList
                ref={flatListRef}
                data={isLoading ? [] : listData}
                renderItem={renderItem}
                keyExtractor={(item: any, index) => item.id || item.collaboratorId || item.invitationId || `item-${index}`}
                contentContainerStyle={{ paddingTop: insets.top + 70, paddingBottom: 120 }}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={EmptyState}
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.palette.primary[500]}
                    />
                }
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
                removeClippedSubviews={true}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
            />

            {/* Float Action Button */}
            <TouchableOpacity
                style={styles.fabContainer}
                onPress={() => { haptics.impact(); setIsInviteModalVisible(true); }}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={[theme.palette.primary[500], theme.palette.primary[600]]}
                    style={styles.fabGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <UserPlus size={24} color="#FFFFFF" />
                    <Text style={styles.fabText}>Invite Member</Text>
                </LinearGradient>
            </TouchableOpacity>

            <InviteMemberModal
                visible={isInviteModalVisible}
                onClose={() => setIsInviteModalVisible(false)}
                onInvite={handleInvite}
                theme={theme}
            />
        </View>
    );
}
