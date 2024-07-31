import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Theme } from '../../constant/theme';

const JobTicketCarousel = ({ jobTicketData,navigation }: any) => {
    const [currentIndexJT, setCurrentIndexJT] = useState<number>(0);
    const flatListRefJT = useRef<FlatList<any> | null>(null);
    const { width } = Dimensions.get('screen');

    const renderJobTicketItem = ({ item }: any) => {
        return (
            <TouchableOpacity
            onPress={() => navigation.navigate('OpenDetails', item)}
            activeOpacity={0.8}>
            <View
                style={{
                    backgroundColor: Theme.white,
                    borderRadius: 20,
                    marginVertical: 10,
                    marginRight: 10,
                    width: width - 53,
                }}>
                <View
                    style={{
                        padding: 20,
                        backgroundColor: Theme.darkGray,
                        borderTopEndRadius: 20,
                        borderTopStartRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <View>
                        <Text style={[styles.textType3, { color: Theme.white }]}>
                            Commission
                        </Text>
                        <View style={{ margin: 1 }}></View>
                        <Text style={[styles.textType1, { color: Theme.white }]}>
                            RM {item?.price}
                        </Text>
                    </View>
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: Theme.Black,
                                width: 95,
                                borderRadius: 30,
                                gap: 5,
                                paddingVertical: 3,
                                justifyContent: 'center',
                            }}>
                            <Text
                                style={[styles.textType3, { color: Theme.white, fontSize: 14, textTransform: 'capitalize' }]}>
                                {item?.mode}
                            </Text>
                            <AntDesign name="arrowright" color={Theme.white} size={15} />
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        marginVertical: 20,
                    }}>
                    <View style={styles.jobTicketImg}>
                        <Image source={require('../../Assets/Images/JTSub.png')} />
                        <Text style={[styles.textType3, { color: Theme.DustyGrey }]}>
                            Subject
                        </Text>
                        <Text style={[styles.textType3, { fontSize: 18, textTransform: 'capitalize' }]}>{item?.subject_name}</Text>
                    </View>
                    <View style={styles.jobTicketImg}>
                        <Image source={require('../../Assets/Images/JTLoc.png')} />
                        <Text style={[styles.textType3, { color: Theme.DustyGrey }]}>
                            Location
                        </Text>
                        <Text style={[styles.textType3, { fontSize: 18 }]}>{item?.city}</Text>
                    </View>
                    <View style={styles.jobTicketImg}>
                        <Image source={require('../../Assets/Images/JTLevel.png')} />
                        <Text style={[styles.textType3, { color: Theme.DustyGrey }]}>
                            Level
                        </Text>
                        <Text style={[styles.textType3, { fontSize: 18 }]}>{item?.categoryName}</Text>
                    </View>
                </View>
            </View>
            </TouchableOpacity>
        );
    };

    const handleScroll = (event: any) => {
        const { contentOffset, layoutMeasurement } = event?.nativeEvent;
        const index = Math.floor(contentOffset?.x / layoutMeasurement?.width);
        setCurrentIndexJT(index);
    };

    const renderPagination = () => {
        return (
            <View style={styles.pagination}>
                {jobTicketData?.map((_: any, index: any) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            currentIndexJT === index ? styles.activeIndicator : null,
                        ]}
                    />
                ))}
            </View>
        );
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (jobTicketData.length > 0) {
                const nextIndex = (currentIndexJT + 1) % jobTicketData.length;
                setCurrentIndexJT(nextIndex);

                // Ensure FlatList ref is available and valid
                if (flatListRefJT.current) {
                    flatListRefJT.current.scrollToIndex({ index: nextIndex, animated: true });
                }
            }
        }, 3000);

        return () => clearInterval(intervalId);
    }, [currentIndexJT, jobTicketData]);

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRefJT}
                data={jobTicketData}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderJobTicketItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                pagingEnabled
            />
            {renderPagination()}
        </View>
    );
};

export default JobTicketCarousel;

const styles = StyleSheet.create({
    textType1: {
        fontWeight: '500',
        fontSize: 24,
        color: Theme.Dune,
        fontFamily: 'Circular Std Medium',
        lineHeight: 24,
        fontStyle: 'normal',
    },
    textType3: {
        color: Theme.Dune,
        fontSize: 16,
        fontFamily: 'Circular Std Medium',
    },
    jobTicketImg: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    container: {
        // flex: 1,
    },
    pagination: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
        backgroundColor: Theme.LightPattensBlue, // Inactive indicator color
    },
    activeIndicator: {
        backgroundColor: Theme.darkGray, // Active indicator color
        width: 30,
        height: 8,
        borderRadius: 10,
    },
});
