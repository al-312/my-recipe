import {
    TextInput,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import CustomButton from "@/components/custom-button";
import theme from "@/theme";
import {Ionicons} from "@expo/vector-icons";
import React, {useState, useRef, useEffect} from "react";

const {width} = Dimensions.get('window');
const modalWidth = width * 0.8 - 40;

interface RecipeInputFormProps {
    handleSubmit: () => void;
    recipe: string;
    setRecipe: (recipe: string) => void;
}

const RecipeInputForm = ({handleSubmit, recipe, setRecipe}: RecipeInputFormProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const searchHistory = [
        "chicken breast", "pasta", "tomatoes", "garlic", "onions"
    ]

    const focusAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const popularIngredients = [
        {name: "Chicken", icon: "🐔", color: "#FFE4B5"},
        {name: "Beef", icon: "🥩", color: "#FFB6C1"},
        {name: "Fish", icon: "🐟", color: "#E0F6FF"},
        {name: "Pasta", icon: "🍝", color: "#FFF8DC"},
        {name: "Rice", icon: "🍚", color: "#F5F5DC"},
        {name: "Vegetables", icon: "🥕", color: "#F0FFF0"},
        {name: "Cheese", icon: "🧀", color: "#FFFACD"},
        {name: "Eggs", icon: "🥚", color: "#FFF8DC"},
    ];

    const dietaryOptions = [
        {name: "Vegetarian", icon: "leaf-outline", color: "#90EE90"},
        {name: "Vegan", icon: "flower-outline", color: "#98FB98"},
        {name: "Gluten-Free", icon: "medical-outline", color: "#FFE4B5"},
        {name: "Keto", icon: "fitness-outline", color: "#F0E68C"},
        {name: "Low-Carb", icon: "barbell-outline", color: "#DDA0DD"},
        {name: "Healthy", icon: "heart-outline", color: "#FFB6C1"},
    ];

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isFocused]);

    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused]);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const addIngredient = (ingredient: string) => {
        if (!selectedIngredients.includes(ingredient)) {
            const newSelected = [...selectedIngredients, ingredient];
            setSelectedIngredients(newSelected);
            setRecipe(newSelected.join(', '));
        }
    };

    const removeIngredient = (ingredient: string) => {
        const newSelected = selectedIngredients.filter(item => item !== ingredient);
        setSelectedIngredients(newSelected);
        setRecipe(newSelected.join(', '));
    };

    const handleTextChange = (text: string) => {
        setRecipe(text);
        const ingredients = text.split(',').map(item => item.trim()).filter(item => item);
        setSelectedIngredients(ingredients);
    };

    const clearAll = () => {
        setRecipe('');
        setSelectedIngredients([]);
    };

    const handleHistorySelect = (item: string) => {
        if (!selectedIngredients.includes(item)) {
            addIngredient(item);
        }
    };

    const animatedBorderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#E0E0E0', theme.colors.primary],
    });

    const animatedBorderWidth = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2],
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardContainer}
        >
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerIcon}>
                        <Ionicons name="restaurant" size={20} color={theme.colors.primary}/>
                    </View>
                    <Text style={styles.title}>What&#39;s in your kitchen?</Text>
                    <Text style={styles.subtitle}>
                        Tell us what ingredients you have, and we&#39;ll find perfect recipes!
                    </Text>
                </View>

                {/* Input Section */}
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>
                        <Ionicons name="search" size={14} color={theme.colors.textSecondary}/>
                        {" "}Search Ingredients
                    </Text>

                    <Animated.View style={[
                        styles.inputContainer,
                        {
                            borderColor: animatedBorderColor,
                            borderWidth: animatedBorderWidth,
                        }
                    ]}>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., chicken, tomatoes, garlic..."
                            placeholderTextColor={theme.colors.textSecondary}
                            value={recipe}
                            onChangeText={handleTextChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            multiline
                            maxLength={200}
                        />
                        {recipe.length > 0 && (
                            <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
                                <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary}/>
                            </TouchableOpacity>
                        )}
                    </Animated.View>

                    <Text style={styles.charCounter}>{recipe.length}/200</Text>
                </View>

                {/* Selected Ingredients Tags */}
                {selectedIngredients.length > 0 && (
                    <View style={styles.selectedSection}>
                        <Text style={styles.sectionTitle}>Selected Ingredients ({selectedIngredients.length})</Text>
                        <View style={styles.tagsContainer}>
                            {selectedIngredients.map((ingredient, index) => (
                                <View key={`selected-${index}`} style={styles.selectedTag}>
                                    <Text style={styles.selectedTagText}>{ingredient}</Text>
                                    <TouchableOpacity
                                        onPress={() => removeIngredient(ingredient)}
                                        style={styles.removeTagButton}
                                    >
                                        <Ionicons name="close" size={12} color={theme.colors.primary}/>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Popular Ingredients */}
                <Animated.View
                    style={[
                        styles.suggestionsSection,
                        {
                            opacity: slideAnim,
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                }),
                            }],
                        }
                    ]}
                >
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="star" size={14} color="#FFD700"/>
                        {" "}Popular Ingredients
                    </Text>
                    <View style={styles.ingredientsGrid}>
                        {popularIngredients.map((item, index) => (
                            <TouchableOpacity
                                key={`popular-${index}`}
                                style={[styles.ingredientCard, {backgroundColor: item.color}]}
                                onPress={() => addIngredient(item.name.toLowerCase())}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.ingredientIcon}>{item.icon}</Text>
                                <Text style={styles.ingredientName}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Dietary Preferences */}
                <View style={styles.dietarySection}>
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="nutrition" size={14} color={theme.colors.primary}/>
                        {" "}Dietary Preferences
                    </Text>
                    <View style={styles.dietaryGrid}>
                        {dietaryOptions.map((option, index) => (
                            <TouchableOpacity
                                key={`dietary-${index}`}
                                style={[styles.dietaryChip, {backgroundColor: option.color + '40'}]}
                                onPress={() => addIngredient(option.name.toLowerCase())}
                                activeOpacity={0.7}
                            >
                                <Ionicons name={option.icon as any} size={14} color={theme.colors.textPrimary}/>
                                <Text style={styles.dietaryText}>{option.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Searches */}
                {searchHistory.length > 0 && !isFocused && (
                    <View style={styles.historySection}>
                        <Text style={styles.sectionTitle}>
                            <Ionicons name="time" size={14} color={theme.colors.textSecondary}/>
                            {" "}Recent Searches
                        </Text>
                        <View style={styles.historyContainer}>
                            {searchHistory.slice(0, 5).map((item, index) => (
                                <TouchableOpacity
                                    key={`history-${index}`}
                                    style={styles.historyChip}
                                    onPress={() => handleHistorySelect(item)}
                                >
                                    <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary}/>
                                    <Text style={styles.historyText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonSection}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={clearAll}
                            disabled={recipe.length === 0}
                        >
                            <Ionicons name="refresh" size={16} color={theme.colors.textSecondary}/>
                            <Text style={styles.secondaryButtonText}>Clear All</Text>
                        </TouchableOpacity>

                        <View style={styles.primaryButtonContainer}>
                            <CustomButton
                                text={`Find Recipes ${selectedIngredients.length > 0 ? `(${selectedIngredients.length})` : ''}`}
                                onPress={handleSubmit}
                                disabled={recipe.trim().length === 0}
                            />
                        </View>
                    </View>

                    <Text style={styles.helpText}>
                        💡 Tip: Add multiple ingredients separated by commas for better results
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RecipeInputForm;

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: theme.spacing.large,
    },
    header: {
        alignItems: 'center',
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.small,
    },
    headerIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.small,
    },
    title: {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginBottom: theme.spacing.small,
    },
    subtitle: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: theme.spacing.small,
    },
    inputSection: {
        paddingHorizontal: theme.spacing.small,
        marginBottom: theme.spacing.medium,
    },
    inputLabel: {
        fontSize: theme.typography.caption.fontSize,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.small,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.default,
        flexDirection: 'row',
        alignItems: 'flex-start',
        minHeight: 50,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
    },
    input: {
        flex: 1,
        padding: theme.spacing.small,
        fontSize: theme.typography.body.fontSize - 2,
        color: theme.colors.textPrimary,
        maxHeight: 100,
    },
    clearButton: {
        padding: theme.spacing.small,
        justifyContent: 'center',
    },
    charCounter: {
        fontSize: 10,
        color: theme.colors.textSecondary,
        textAlign: 'right',
        marginTop: 4,
    },
    selectedSection: {
        paddingHorizontal: theme.spacing.small,
        marginBottom: theme.spacing.medium,
    },
    sectionTitle: {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.small,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    selectedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        margin: 2,
    },
    selectedTagText: {
        color: theme.colors.background,
        fontSize: 12,
        fontWeight: '500',
        marginRight: 4,
    },
    removeTagButton: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: theme.colors.background + '40',
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionsSection: {
        paddingHorizontal: theme.spacing.small,
        marginBottom: theme.spacing.medium,
    },
    ingredientsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    ingredientCard: {
        width: (modalWidth - theme.spacing.small * 2 - 24) / 4,
        aspectRatio: 1,
        borderRadius: theme.radius.default,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
    },
    ingredientIcon: {
        fontSize: 20,
        marginBottom: 2,
    },
    ingredientName: {
        fontSize: 10,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    dietarySection: {
        paddingHorizontal: theme.spacing.small,
        marginBottom: theme.spacing.medium,
    },
    dietaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    dietaryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.primary + '60',
    },
    dietaryText: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.textPrimary,
        marginLeft: 4,
    },
    historySection: {
        paddingHorizontal: theme.spacing.small,
        marginBottom: theme.spacing.medium,
    },
    historyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    historyChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    historyText: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        marginLeft: 4,
    },
    buttonSection: {
        paddingHorizontal: theme.spacing.small,
        paddingBottom: theme.spacing.medium,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: theme.spacing.small,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: theme.radius.default,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: theme.colors.surface,
    },
    secondaryButtonText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginLeft: 4,
        fontWeight: '500',
    },
    primaryButtonContainer: {
        flex: 1,
    },
    helpText: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 16,
    },
});