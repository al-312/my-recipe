import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Animated,
    Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from "expo-router";
import {Image} from "expo-image";
import {baseApi} from "@/api/base-api";
import {IRecipeDetails} from "@/types/IRecipeDetails";
import theme from "@/theme";

const RecipeDetailsScreen = () => {
    const {id} = useLocalSearchParams();
    const router = useRouter();
    const [recipe, setRecipe] = useState<IRecipeDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
    const scrollY = new Animated.Value(0);

    const getRecipe = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseApi.get(`/recipes/${id}/information`);
            setRecipe(response.data as IRecipeDetails);
        } catch (e) {
            console.log(e);
            setError("Failed to load recipe details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getRecipe();
        }
    }, [id]);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const shareRecipe = () => {
        Alert.alert("Share Recipe", "Share functionality would be implemented here");
    };

    const goBack = () => {
        router.back();
    };

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary}/>
                    <Text style={styles.loadingText}>Loading recipe...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !recipe) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background}/>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={80} color="#FF6B6B"/>
                    <Text style={styles.errorTitle}>Recipe Not Found</Text>
                    <Text style={styles.errorSubtitle}>{error || "This recipe could not be loaded."}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={getRecipe}>
                        <Ionicons name="refresh" size={20} color="#FFF"/>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const renderHeader = () => (
        <View style={styles.imageContainer}>
            <Image source={{uri: recipe.image}} style={styles.image}/>
            <View style={styles.imageOverlay}/>

            {/* Fixed Header */}
            <Animated.View style={[styles.fixedHeader, {opacity: headerOpacity}]}>
                <Text style={styles.fixedHeaderTitle} numberOfLines={1}>{recipe.title}</Text>
            </Animated.View>

            {/* Navigation Controls */}
            <View style={styles.headerControls}>
                <TouchableOpacity style={styles.headerButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="#FFF"/>
                </TouchableOpacity>
                <View style={styles.headerRightControls}>
                    <TouchableOpacity style={styles.headerButton} onPress={shareRecipe}>
                        <Ionicons name="share-outline" size={24} color="#FFF"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton} onPress={toggleFavorite}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? "#FF6B6B" : "#FFF"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderQuickInfo = () => (
        <View style={styles.quickInfoContainer}>
            <View style={styles.quickInfoItem}>
                <View style={styles.quickInfoIcon}>
                    <Ionicons name="time-outline" size={20} color={theme.colors.primary}/>
                </View>
                <Text style={styles.quickInfoLabel}>Total</Text>
                <Text style={styles.quickInfoValue}>
                    {(recipe.preparationMinutes || 0) + (recipe.cookingMinutes || 0)} min
                </Text>
            </View>
            <View style={styles.quickInfoItem}>
                <View style={styles.quickInfoIcon}>
                    <Ionicons name="people-outline" size={20} color={theme.colors.primary}/>
                </View>
                <Text style={styles.quickInfoLabel}>Servings</Text>
                <Text style={styles.quickInfoValue}>{recipe.servings}</Text>
            </View>
            <View style={styles.quickInfoItem}>
                <View style={styles.quickInfoIcon}>
                    <Ionicons name="fitness-outline" size={20} color={theme.colors.primary}/>
                </View>
                <Text style={styles.quickInfoLabel}>Health</Text>
                <Text style={styles.quickInfoValue}>{recipe.healthScore}/100</Text>
            </View>
            <View style={styles.quickInfoItem}>
                <View style={styles.quickInfoIcon}>
                    <Ionicons name="card-outline" size={20} color={theme.colors.primary}/>
                </View>
                <Text style={styles.quickInfoLabel}>Cost</Text>
                <Text style={styles.quickInfoValue}>${(recipe.pricePerServing / 100).toFixed(2)}</Text>
            </View>
        </View>
    );

    const renderTags = () => (
        <View style={styles.tagsSection}>
            {recipe.diets && recipe.diets.length > 0 && (
                <View style={styles.tagGroup}>
                    <Text style={styles.tagGroupTitle}>Dietary</Text>
                    <View style={styles.tagsContainer}>
                        {recipe.diets.map((diet, index) => (
                            <View key={index} style={[styles.tag, styles.dietTag]}>
                                <Ionicons name="leaf-outline" size={14} color="#4CAF50"/>
                                <Text style={[styles.tagText, styles.dietTagText]}>{diet}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {recipe.occasions && recipe.occasions.length > 0 && (
                <View style={styles.tagGroup}>
                    <Text style={styles.tagGroupTitle}>Perfect For</Text>
                    <View style={styles.tagsContainer}>
                        {recipe.occasions.map((occasion, index) => (
                            <View key={index} style={[styles.tag, styles.occasionTag]}>
                                <Ionicons name="calendar-outline" size={14} color="#FF9800"/>
                                <Text style={[styles.tagText, styles.occasionTagText]}>{occasion}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );

    const renderTabNavigation = () => (
        <View style={styles.tabNavigation}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
                onPress={() => setActiveTab('ingredients')}
            >
                <Ionicons
                    name="list-outline"
                    size={20}
                    color={activeTab === 'ingredients' ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text style={[
                    styles.tabText,
                    activeTab === 'ingredients' && styles.activeTabText
                ]}>
                    Ingredients
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'instructions' && styles.activeTab]}
                onPress={() => setActiveTab('instructions')}
            >
                <Ionicons
                    name="list-outline"
                    size={20}
                    color={activeTab === 'instructions' ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text style={[
                    styles.tabText,
                    activeTab === 'instructions' && styles.activeTabText
                ]}>
                    Instructions
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderIngredients = () => (
        <View style={styles.ingredientsContainer}>
            {recipe.extendedIngredients && recipe.extendedIngredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                    <View style={styles.ingredientBullet}/>
                    <Text style={styles.ingredientText}>{ingredient.original}</Text>
                </View>
            ))}
        </View>
    );

    const renderInstructions = () => {
        if (!recipe.instructions) {
            return (
                <View style={styles.noInstructionsContainer}>
                    <Ionicons name="document-text-outline" size={48} color={theme.colors.textSecondary}/>
                    <Text style={styles.noInstructionsText}>No instructions available</Text>
                </View>
            );
        }

        const cleanInstructions = recipe.instructions.replace(/<[^>]*>/g, '');

        return (
            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsText}>{cleanInstructions}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>

            <Animated.ScrollView
                style={styles.scrollView}
                bounces={true}
                alwaysBounceVertical={true}
                overScrollMode="always"
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: false}
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {renderHeader()}

                <View style={styles.content}>
                    <Text style={styles.title}>{recipe.title}</Text>

                    {renderQuickInfo()}
                    {renderTags()}
                    {renderTabNavigation()}

                    {activeTab === 'ingredients' ? renderIngredients() : renderInstructions()}
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.medium,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.large,
    },
    errorTitle: {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: '600',
        color: '#FF6B6B',
        marginTop: theme.spacing.medium,
        marginBottom: theme.spacing.small,
    },
    errorSubtitle: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: theme.spacing.large,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.medium,
        borderRadius: theme.radius.default,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: theme.typography.button.fontSize,
        fontWeight: '600',
        marginLeft: 8,
    },
    imageContainer: {
        position: 'relative',
        height: 300,
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    fixedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: theme.colors.surface,
        justifyContent: 'flex-end',
        paddingBottom: theme.spacing.small,
        paddingHorizontal: 60,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
    },
    fixedHeaderTitle: {
        fontSize: theme.typography.h1.fontSize,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    headerControls: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.medium,
    },
    headerRightControls: {
        flexDirection: 'row',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.small,
    },
    content: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.radius.default,
        borderTopRightRadius: theme.radius.default,
        marginTop: -20,
        paddingTop: theme.spacing.large,
        paddingHorizontal: theme.spacing.medium,
        paddingBottom: theme.spacing.large,
    },
    title: {
        fontSize: theme.typography.h1.fontSize,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.large,
        lineHeight: 32,
    },
    quickInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.default,
        paddingVertical: theme.spacing.large,
        marginBottom: theme.spacing.large,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
    },
    quickInfoItem: {
        alignItems: 'center',
    },
    quickInfoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.small,
    },
    quickInfoLabel: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
        marginBottom: 2,
        fontWeight: '500',
    },
    quickInfoValue: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textPrimary,
        fontWeight: '600',
    },
    tagsSection: {
        marginBottom: theme.spacing.large,
    },
    tagGroup: {
        marginBottom: theme.spacing.medium,
    },
    tagGroupTitle: {
        fontSize: theme.typography.h1.fontSize,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.small,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.small,
        paddingVertical: 6,
        borderRadius: theme.radius.default,
        marginRight: theme.spacing.small,
        marginBottom: theme.spacing.small,
    },
    dietTag: {
        backgroundColor: '#4CAF50' + '20',
        borderWidth: 1,
        borderColor: '#4CAF50' + '40',
    },
    occasionTag: {
        backgroundColor: '#FF9800' + '20',
        borderWidth: 1,
        borderColor: '#FF9800' + '40',
    },
    tagText: {
        fontSize: theme.typography.caption.fontSize,
        fontWeight: '600',
        marginLeft: 4,
    },
    dietTagText: {
        color: '#4CAF50',
    },
    occasionTagText: {
        color: '#FF9800',
    },
    tabNavigation: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.default,
        padding: 4,
        marginBottom: theme.spacing.large,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.small,
        borderRadius: theme.radius.default,
    },
    activeTab: {
        backgroundColor: theme.colors.primary + '20',
    },
    tabText: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        fontWeight: '500',
        marginLeft: 6,
    },
    activeTabText: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    ingredientsContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.default,
        padding: theme.spacing.medium,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.small,
        paddingRight: theme.spacing.small,
    },
    ingredientBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
        marginTop: 8,
        marginRight: theme.spacing.small,
    },
    ingredientText: {
        flex: 1,
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textPrimary,
        lineHeight: 22,
        fontWeight: '400',
    },
    instructionsContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.default,
        padding: theme.spacing.medium,
    },
    instructionsText: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textPrimary,
        lineHeight: 26,
        fontWeight: '400',
    },
    noInstructionsContainer: {
        alignItems: 'center',
        paddingVertical: theme.spacing.large * 2,
    },
    noInstructionsText: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.medium,
        fontWeight: '500',
    },
});

export default RecipeDetailsScreen;