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
  onPlaceSelected: (data: any, details: any) => void;
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
              // @ts-ignore - setAddressText exists on the ref but is not in the type definition
              inputRef.current?.setAddressText?.('');
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
            onPlaceSelected(data, details);
            setSearchOpen(false);
            inputRef.current?.blur();
          }}
          textInputProps={{
            onFocus: () => setSearchOpen(true),
            placeholderTextColor: Colors.dark.placeholder,
          }}
          query={{
            key: googleApiKey,
            language: 'it',
          }}
          styles={{
            textInput: styles.searchInput,
            textInputContainer: styles.textInputContainer,
            container: styles.autocompleteContainer,
            listView: styles.listView,
            row: styles.row,
            description: styles.description,
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
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
    zIndex: 10,
    width:  '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    height: 56,
    zIndex: 10,
  },
  textInputContainer: {
    flex: 1,
    zIndex: 10,
  },
  autocompleteContainer: {
    flex: 0,
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: Colors.dark.text,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
  },
  listView: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.full,
    marginTop: 4,
    zIndex: 10,
    maxHeight: 300,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border || '#333',
  },
  description: {
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
  },
});

export default MapSearchBar;
