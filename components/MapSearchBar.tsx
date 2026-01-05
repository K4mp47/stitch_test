import { ArrowLeft, Search, Settings } from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { BorderRadius, Colors } from '../constants/theme';

interface MapSearchBarProps {
  googleApiKey: string;
  onPlaceSelected: (details: any) => void;
  onSettingsPress: () => void;
}

const MapSearchBar = ({ googleApiKey, onPlaceSelected, onSettingsPress }: MapSearchBarProps) => {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const inputRef = React.useRef<TextInput | null>(null);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            if (searchOpen) {
              inputRef.current?.blur();
              setSearchOpen(false);
            } else {
              inputRef.current?.focus();
              setSearchOpen(true);
            }
          }}
        >
          {!searchOpen ? (
            <Search color={Colors.dark.placeholder} size={24} />
          ) : (
            <ArrowLeft color={Colors.dark.placeholder} size={24} />
          )}
        </TouchableOpacity>
        <GooglePlacesAutocomplete
          ref={inputRef as any}
          placeholder="Cerca una località..."
          onPress={(data, details = null) => {
            onPlaceSelected(details);
          }}
          query={{
            key: googleApiKey,
            language: 'it',
          }}
          styles={{
            textInput: styles.searchInput,
            textInputContainer: {
                flex: 1,
            }
          }}
        />
        <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
          <Settings color={Colors.dark.placeholder} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginTop: 12,
    marginHorizontal: 16,
    zIndex: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    height: 56,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: Colors.dark.text,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
  },
});

export default MapSearchBar;
