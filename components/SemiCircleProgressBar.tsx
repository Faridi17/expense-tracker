import { colors } from '@/constants/theme';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

type Props = {
    progress: number; 
    size?: number;
    strokeWidth?: number;
};

const SemiCircleProgressBar: React.FC<Props> = ({
    progress,
    size = 220,
    strokeWidth = 17,
}) => {
    const radius = (size - strokeWidth) / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    const polarToCartesian = (angle: number) => {
        const rad = (angle * Math.PI) / 180;
        return {
            x: centerX + radius * Math.cos(rad),
            y: centerY + radius * Math.sin(rad),
        };
    };

    const describeArc = (startAngle: number, endAngle: number) => {
        const start = polarToCartesian(endAngle);
        const end = polarToCartesian(startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    const startAngle = 180;
    const endAngle = 180 + (progress / 100) * 180;
    const filledArc = describeArc(startAngle, endAngle);

    const progressColor =
        progress > 90
            ? colors.primary
            : progress > 50
                ? colors.yellow
                : colors.rose;

    const backgroundColor = colors.neutral700;

    const startCoord = polarToCartesian(startAngle);
    const endCoord = polarToCartesian(endAngle);

    return (
        <View style={{ width: size, height: size / 2, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                {/* Background */}
                <Path
                    d={describeArc(180, 360)}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Background rounded ends */}
                <Circle
                    cx={polarToCartesian(180).x}
                    cy={polarToCartesian(180).y}
                    r={strokeWidth / 2}
                    fill={backgroundColor}
                />
                <Circle
                    cx={polarToCartesian(360).x}
                    cy={polarToCartesian(360).y}
                    r={strokeWidth / 2}
                    fill={backgroundColor}
                />

                {/* Progress path */}
                <Path
                    d={filledArc}
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress rounded ends */}
                {progress > 0 && (
                    <>
                        <Circle
                            cx={startCoord.x}
                            cy={startCoord.y}
                            r={strokeWidth / 2}
                            fill={progressColor}
                        />
                        <Circle
                            cx={endCoord.x}
                            cy={endCoord.y}
                            r={strokeWidth / 2}
                            fill={progressColor}
                        />
                    </>
                )}
            </Svg>

            {/* Teks di tengah */}
            <View style={StyleSheet.absoluteFillObject}>
                <View style={styles.centerText}>
                    <Text style={styles.percentText}>{`${progress}%`}</Text>
                    <Text style={styles.labelText}>Terkumpul</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '-2%',
        left: 0,
        right: 0,
    },
    percentText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.neutral200,
    },
    labelText: {
        fontSize: 15,
        color: colors.neutral350,
    },
});

export default SemiCircleProgressBar;
