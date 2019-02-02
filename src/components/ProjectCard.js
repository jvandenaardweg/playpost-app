import React from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { Tag } from '../components/Tag'

export class ProjectCard extends React.PureComponent {
  static defaultProps = {
    title: 'Frontend Developer with React experience',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac ips.',
    startDate: '01-01-2019',
    duration: '3 months',
    hourlyRate: '60 - 85',
    tags: [
      { label: 'Senior', color: 'blue' },
      { label: 'JavaScript', color: 'blue' },
      { label: 'React', color: 'blue' },
      { label: 'Node', color: 'blue' }
    ],
    organization: {
      name: 'DEPT Agency',
      city: 'Amsterdam',
      country: 'Netherlands',
      imageUrl: 'https://placehold.it/42x42'
    }
  }

  render() {
    const { icon, onPress, title, subtitle, startDate, duration, hourlyRate, tags, organization } = this.props

    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={styles.meta}>
            <View>
              <Text style={styles.metaLabel}>Start date</Text>
              <Text>{startDate}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text>{duration}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Hourly rate</Text>
              <Text>{hourlyRate}</Text>
            </View>
          </View>
          <View style={styles.tags}>
            {tags.map((tag, index) => (
              <View style={styles.tag} key={index}>
                <Tag name={tag.label} />
              </View>
            ))}
          </View>
          <View style={styles.organization}>
            <Image
              style={styles.organizationImage}
              source={{uri: organization.imageUrl}}
            />
            <View style={styles.organizationMetaContainer}>
              <Text style={styles.organizationTitle}>{organization.name}</Text>
              <Text style={styles.organizationMeta}>{organization.city}, {organization.country}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    shadowColor: '#00203E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 1
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 12
  },
  subtitle: {
    fontSize: 14,
    color: '#9B9B9B'
  },
  meta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
    justifyContent: 'space-between'
  },
  metaLabel: {
    fontSize: 11,
    color: '#9B9B9B',
    fontWeight: '400',
    textTransform: 'uppercase',
    marginBottom: 2
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000'
  },
  tags: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
  },
  tag: {
    marginRight: 5
  },
  organization: {
    padding: 20,
    flex: 1,
    flexDirection: 'row'
  },
  organizationImage: {
    width: 42,
    height: 42,
    marginRight: 10,
    borderRadius: 4
  },
  organizationMetaContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  organizationTitle: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '400',
    marginBottom: 2
  },
  organizationMeta: {
    fontSize: 12,
    color: '#9B9B9B'
  }
});
