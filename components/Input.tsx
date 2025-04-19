import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import { InputProps } from '@/types'
import { colors, radius, spacingX } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'

const Input = (props: InputProps) => {
    const isDisabled = props.editable === false;

    return (
        <View style={[
            styles.container,
            props.containerStyle && props.containerStyle,
            isDisabled && styles.disabledContainer
        ]}>
            {props.icon && props.icon}
            <TextInput
                style={[styles.input, props.inputStyle, isDisabled && styles.disabledText]}
                placeholderTextColor={colors.neutral400}
                ref={props.inputRef && props.inputRef}
                editable={props.editable}
                {...props}
            />
        </View>
    )
}

export default Input;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: verticalScale(54),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15,
        gap: spacingX._10,
        backgroundColor: colors.neutral800
    },
    disabledContainer: {
        borderColor: colors.neutral400,
        backgroundColor: colors.neutral800
    },
    input: {
        flex: 1,
        color: colors.white,
        fontSize: verticalScale(14)
    },
    disabledText: {
        color: colors.neutral400
    }
});
