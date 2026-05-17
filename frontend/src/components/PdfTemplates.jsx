import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf' },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.ttf', fontWeight: 'bold' }
    ]
});

// Common Styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter',
    },
    // Modern Template Styles
    modernSidebar: {
        width: '30%',
        padding: 20,
        color: 'white',
        height: '100%',
    },
    modernMain: {
        width: '70%',
        padding: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        alignSelf: 'center',
        objectFit: 'cover',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    sidebarName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white',
        textAlign: 'center',
    },
    designation: {
        fontSize: 14,
        marginBottom: 20,
        color: '#666',
    },
    sidebarDesignation: {
        fontSize: 12,
        marginBottom: 20,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
        textTransform: 'uppercase',
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    sidebarSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        textTransform: 'uppercase',
        color: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
        paddingBottom: 5,
    },
    text: {
        fontSize: 10,
        marginBottom: 3,
        lineHeight: 1.4,
        color: '#444',
    },
    sidebarText: {
        fontSize: 10,
        marginBottom: 3,
        lineHeight: 1.4,
        color: 'rgba(255,255,255,0.9)',
    },
    skillBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        marginBottom: 5,
        marginRight: 5,
        fontSize: 10,
        color: 'white',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    experienceItem: {
        marginBottom: 15,
    },
    dateLocation: {
        fontSize: 9,
        color: '#888',
        marginBottom: 2,
    },
    role: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#333'
    }
});

// Template Components
export const ModernPdfValues = ({ data, palette }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Sidebar */}
                <View style={[styles.modernSidebar, { backgroundColor: palette.primary }]}>
                    {data.personal?.uploadPhoto && (
                        <Image
                            style={styles.profileImage}
                            src={typeof data.personal.uploadPhoto === 'string' ? data.personal.uploadPhoto : URL.createObjectURL(data.personal.uploadPhoto)}
                        />
                    )}

                    <Text style={styles.sidebarName}>{data.personal?.fullName}</Text>
                    <Text style={styles.sidebarDesignation}>{data.personal?.designation}</Text>

                    {/* Contact */}
                    <View>
                        <Text style={styles.sidebarSectionTitle}>Contact</Text>
                        <Text style={styles.sidebarText}>{data.personal?.email}</Text>
                        <Text style={styles.sidebarText}>{data.personal?.phone}</Text>
                        <Text style={styles.sidebarText}>{data.personal?.address}</Text>
                        {data.personal?.website && <Text style={styles.sidebarText}>{data.personal.website}</Text>}
                    </View>

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <View>
                            <Text style={styles.sidebarSectionTitle}>Skills</Text>
                            <View style={styles.skillsContainer}>
                                {data.skills.map((skill, index) => (
                                    <Text key={index} style={styles.skillBadge}>{skill.name}</Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Social Links if any */}
                    {data.socialLinks && data.socialLinks.length > 0 && (
                        <View>
                            <Text style={styles.sidebarSectionTitle}>Social</Text>
                            {data.socialLinks.map((link, index) => (
                                <Text key={index} style={styles.sidebarText}>{link.platform}: {link.url}</Text>
                            ))}
                        </View>
                    )}

                </View>

                {/* Main Content */}
                <View style={styles.modernMain}>
                    {/* Summary */}
                    {data.summary && (
                        <View>
                            <Text style={styles.sectionTitle}>Professional Summary</Text>
                            <Text style={styles.text}>{data.summary}</Text>
                        </View>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <View>
                            <Text style={styles.sectionTitle}>Experience</Text>
                            {data.experience.map((exp, index) => (
                                <View key={index} style={styles.experienceItem}>
                                    <Text style={styles.role}>{exp.title}</Text>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: palette.secondary }}>{exp.company}</Text>
                                    <Text style={styles.dateLocation}>{exp.dates} | {exp.location}</Text>
                                    <Text style={[styles.text, { marginTop: 4 }]}>{exp.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <View>
                            <Text style={styles.sectionTitle}>Education</Text>
                            {data.education.map((edu, index) => (
                                <View key={index} style={styles.experienceItem}>
                                    <Text style={styles.role}>{edu.degree}</Text>
                                    <Text style={{ fontSize: 10, color: '#555' }}>{edu.school}</Text>
                                    <Text style={styles.dateLocation}>{edu.dates} | {edu.location}</Text>
                                    <Text style={styles.text}>{edu.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Projects */}
                    {data.projects && data.projects.length > 0 && (
                        <View>
                            <Text style={styles.sectionTitle}>Projects</Text>
                            {data.projects.map((proj, index) => (
                                <View key={index} style={styles.experienceItem}>
                                    <Text style={styles.role}>{proj.title}</Text>
                                    <Text style={[styles.text, { marginTop: 2 }]}>{proj.description}</Text>
                                    <Text style={[styles.text, { fontSize: 8 }]}>{proj.link}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                </View>
            </Page>
        </Document>
    );
};
