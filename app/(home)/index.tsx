import {
    FlatList,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import CustomModal from "@/components/cutsom-modal";
import React, {useState} from "react";
import RecipeInputForm from "@/app/(home)/recipe-input-form";
import {Image} from "expo-image";
import theme from "@/theme";
import NativeSafeAreaView from "react-native-safe-area-context/src/specs/NativeSafeAreaView";
import {baseApi} from "@/api/base-api";
import {Link} from "expo-router";
import {IRecipe} from "@/types/IRecipe";
import {Ionicons} from "@expo/vector-icons";


export default function Index() {
    const [visible, setVisible] = useState(false);
    const [recipe, setRecipe] = useState<IRecipe[]>([]);
    const [ingredients, setIngredients] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseApi.get(`/recipes/complexSearch?includeIngredients=${ingredients}`);
            setRecipe(response.data.results as IRecipe[]);
        } catch (e) {
            console.log(e);
            setError("Failed to fetch recipes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        await getData();
        setVisible(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await getData();
        setRefreshing(false);
    };

    const openModal = () => {
        setVisible(true);
    };

    function closeModal() {
        setVisible(false);
    }

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={80} color={theme.colors.textSecondary}/>
            <Text style={styles.emptyTitle}>No Recipes Found</Text>
            <Text style={styles.emptySubtitle}>
                Try searching with different ingredients to discover amazing recipes!
            </Text>
            <TouchableOpacity style={styles.searchButton} onPress={openModal}>
                <Ionicons name="search" size={20} color={theme.colors.background}/>
                <Text style={styles.searchButtonText}>Search Recipes</Text>
            </TouchableOpacity>
        </View>
    );

    const renderError = () => (
        <View style={styles.errorState}>
            <Ionicons name="alert-circle-outline" size={80} color="#FF6B6B"/>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorSubtitle}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={getData}>
                <Ionicons name="refresh" size={20} color={theme.colors.background}/>
                <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                <Text style={styles.header}>Recommended Recipes</Text>
                <Text style={styles.subHeader}>
                    {ingredients ? `Results for "${ingredients}"` : "Discover delicious recipes"}
                </Text>
            </View>
            <TouchableOpacity style={styles.filterButton} onPress={openModal}>
                <Ionicons name="search-outline" size={24} color={theme.colors.primary}/>
            </TouchableOpacity>
        </View>
    );

    const renderRecipeCard = ({item}: { item: IRecipe }) => (
        <Link href={{pathname: "/details/[id]", params: {id: item.id}}} asChild>
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: item.image}} style={styles.image}/>
                    <View style={styles.imageOverlay}>
                        <View style={styles.favoriteButton}>
                            <Ionicons name="heart-outline" size={20} color="#FFF"/>
                        </View>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.textTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <View style={styles.recipeInfo}>
                        <View style={styles.infoItem}>
                            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary}/>
                            <Text style={styles.infoText}>30 min</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary}/>
                            <Text style={styles.infoText}>4 servings</Text>
                        </View>
                    </View>
                    <View style={styles.tagsContainer}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Easy</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Healthy</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );

    if (loading && recipe.length === 0) {
        return (
            <NativeSafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background}/>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary}/>
                    <Text style={styles.loadingText}>Finding delicious recipes...</Text>
                </View>
            </NativeSafeAreaView>
        );
    }

    return (
        <NativeSafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background}/>

            <CustomModal visible={visible} onClose={closeModal}
                         title={"Find Your Perfect Recipe"}>
                <View style={{marginBottom: 16}}>
                    <RecipeInputForm
                        handleSubmit={handleSubmit}
                        recipe={ingredients}
                        setRecipe={setIngredients}
                    />
                </View>
            </CustomModal>

            <FlatList
                data={recipe}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={[
                    styles.listContainer,
                    recipe.length === 0 && {flex: 1}
                ]}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={error ? renderError : renderEmptyState}
                renderItem={renderRecipeCard}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                ItemSeparatorComponent={() => <View style={{height: 16}}/>}
            />

            {/*{recipe.length > 0 && (*/}
            {/*    <TouchableOpacity style={styles.fab} onPress={openModal}>*/}
            {/*        <Ionicons name="search" size={24} color="#FFF" />*/}
            {/*    </TouchableOpacity>*/}
            {/*)}*/}
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.medium,
        marginBottom: theme.spacing.small,
    },
    headerContent: {
        flex: 1,
    },
    header: {
        fontSize: theme.typography.h1.fontSize,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    subHeader: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        fontWeight: '400',
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
    },
    listContainer: {
        paddingHorizontal: theme.spacing.medium,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.default,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 8,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 200,
        objectFit: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        padding: theme.spacing.medium,
    },
    textTitle: {
        paddingTop:3,
        fontSize: theme.typography.h1.fontSize,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.small,
        lineHeight: 24,
    },
    recipeInfo: {
        flexDirection: 'row',
        marginBottom: theme.spacing.small,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: theme.spacing.medium,
    },
    infoText: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
        marginLeft: 4,
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: theme.colors.primary + '20',
        borderRadius: theme.radius.default,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.large,
    },
    emptyTitle: {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.medium,
        marginBottom: theme.spacing.small,
    },
    emptySubtitle: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: theme.spacing.large,
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.medium,
        borderRadius: theme.radius.default,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
    },
    searchButtonText: {
        color: theme.colors.background,
        fontSize: theme.typography.button.fontSize,
        fontWeight: '600',
        marginLeft: 8,
    },
    errorState: {
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
        color: theme.colors.background,
        fontSize: theme.typography.button.fontSize,
        fontWeight: '600',
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.medium,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 8,
    },
});