/**
 * Multiple ways to import:
 * 1- Importing a specific font as Icon
 * -- import Icon from './lib/Icons/FontAwesome'
 *
 * 2- Importing a specific font as its name
 * -- import {FontAwesome} from './lib/Icons'
 *
 * 3- Importing all fonts in an Icon object
 * -- import * as Icon from './lib/Icons'
 */
import React from 'react';
// import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIconsI from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIconsI from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeI from 'react-native-vector-icons/FontAwesome';
import FontAwesome5I, { FontAwesome5IconProps } from 'react-native-vector-icons/FontAwesome5';
import FoundationI from 'react-native-vector-icons/Foundation';
import EvilIconsI from 'react-native-vector-icons/EvilIcons';
import OcticonsI from 'react-native-vector-icons/Octicons';
import IoniconsI from 'react-native-vector-icons/Ionicons';
import FeatherI from 'react-native-vector-icons/Feather';
import EntypoI from 'react-native-vector-icons/Entypo';
import ZocialI from 'react-native-vector-icons/Zocial';
import { IconProps } from 'react-native-vector-icons/Icon';

// export const MaterialCommunityIcons = (props: IconProps) => <MaterialCommunityIconsI {...props} />;)
export const SimpleLineIcons = (props: IconProps) => <SimpleLineIconsI {...props} />;
export const MaterialIcons = (props: IconProps) => <MaterialIconsI {...props} />;
export const FontAwesome = (props: IconProps) => <FontAwesomeI {...props} />;
export const FontAwesome5 = (props: FontAwesome5IconProps) => <FontAwesome5I {...props} />;
export const Foundation = (props: IconProps) => <FoundationI {...props} />;
export const EvilIcons = (props: IconProps) => <EvilIconsI {...props} />;
export const Ionicons = (props: IconProps) => <IoniconsI {...props} />;
export const Octicons = (props: IconProps) => <OcticonsI {...props} />;
export const Feather = (props: IconProps) => <FeatherI {...props} />;
export const Entypo = (props: IconProps) => <EntypoI {...props} />;
export const Zocial = (props: IconProps) => <ZocialI {...props} />;
