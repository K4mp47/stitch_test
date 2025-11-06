import 'package:climate_watch/widgets/custom_switch.dart';
import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _is4x4 = false;
  bool _notificationsEnabled = true;
  bool _weatherAlerts = true;
  bool _floodAlerts = true;
  bool _fireAlerts = false;
  double _alertRadius = 50;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F1323),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F1323),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Impostazioni',
          style: TextStyle(
            color: Colors.white,
            fontFamily: 'SpaceGrotesk',
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Profile
            const Text(
              'Profilo Utente',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
                fontFamily: 'SpaceGrotesk',
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: const Color(0xFF192633),
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 28,
                    backgroundImage: NetworkImage(
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Pb8Y8HOPDGXDjnN3l6H51OcyBY1PfPQbUKdcWKkeRRjDif5hDamwwE5GlVOzphOdHKXKmeasAYMkQxCaIONVX9mHQCGUZXXegXmhk-nWyW1lJG-VrKKCUvkHVTMS46NRY2rOqencWCWiZKyQNjh5roUbAVzxvpR_V50ptAhQt2Bvo6opfpDrko21b-AStH2P6dE7_eMwIQHBQwYuW3vFb43HEpMCFw_3F06-haBS21Ibpr8DVHMMFEHICGGrY3GkmIEfHb-jRKTV'),
                  ),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Mario Rossi',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'SpaceGrotesk',
                          ),
                        ),
                        Text(
                          'mario.rossi@email.com',
                          style: TextStyle(
                            color: Color(0xFF92ADC9),
                            fontFamily: 'SpaceGrotesk',
                          ),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF233648),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                    child: const Text(
                      'Modifica',
                      style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'SpaceGrotesk',
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Vehicle Information
            const Text(
              'Informazioni Veicolo',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
                fontFamily: 'SpaceGrotesk',
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: const Color(0xFF192633),
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Column(
                children: [
                  // Vehicle Type, Model, Plate
                  // ... (omitting for brevity, will add text fields later)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Veicolo 4x4',
                        style: TextStyle(
                          color: Colors.white,
                          fontFamily: 'SpaceGrotesk',
                        ),
                      ),
                      CustomSwitch(
                        value: _is4x4,
                        onChanged: (value) => setState(() => _is4x4 = value),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Notification Settings
            const Text(
              'Impostazioni Notifiche',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
                fontFamily: 'SpaceGrotesk',
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: const Color(0xFF192633),
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Column(
                children: [
                  _notificationSettingItem(
                    title: 'Abilita Notifiche',
                    value: _notificationsEnabled,
                    onChanged: (value) => setState(() => _notificationsEnabled = value),
                  ),
                  const Divider(color: Color(0xFF324D67)),
                  _notificationSettingItem(
                    title: 'Allerta Meteo',
                    value: _weatherAlerts,
                    onChanged: (value) => setState(() => _weatherAlerts = value),
                  ),
                  const Divider(color: Color(0xFF324D67)),
                  _notificationSettingItem(
                    title: 'Alluvioni',
                    value: _floodAlerts,
                    onChanged: (value) => setState(() => _floodAlerts = value),
                  ),
                  const Divider(color: Color(0xFF324D67)),
                  _notificationSettingItem(
                    title: 'Incendi',
                    value: _fireAlerts,
                    onChanged: (value) => setState(() => _fireAlerts = value),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Raggio di allerta',
                        style: TextStyle(
                          color: Colors.white,
                          fontFamily: 'SpaceGrotesk',
                        ),
                      ),
                      Text(
                        '${_alertRadius.toInt()} km',
                        style: const TextStyle(
                          color: Color(0xFF607AFB),
                          fontFamily: 'SpaceGrotesk',
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: _alertRadius,
                    min: 10,
                    max: 100,
                    onChanged: (value) => setState(() => _alertRadius = value),
                    activeColor: const Color(0xFF137FEC),
                    inactiveColor: const Color(0xFF233648),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Account and Security
            const Text(
              'Account e Sicurezza',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
                fontFamily: 'SpaceGrotesk',
              ),
            ),
            const SizedBox(height: 16),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF192633),
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Column(
                children: [
                  _accountSettingItem(title: 'Modifica Password', onTap: () {}),
                  const Divider(color: Color(0xFF324D67), height: 1),
                  _accountSettingItem(title: 'Impostazioni Privacy', onTap: () {}),
                  const Divider(color: Color(0xFF324D67), height: 1),
                  _accountSettingItem(title: 'Log Out', onTap: () {}, isDestructive: true),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ElevatedButton(
          onPressed: () {},
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF607AFB),
            minimumSize: const Size(double.infinity, 56),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12.0),
            ),
          ),
          child: const Text(
            'Salva Modifiche',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16.0,
              fontWeight: FontWeight.bold,
              fontFamily: 'SpaceGrotesk',
            ),
          ),
        ),
      ),
    );
  }

  Widget _notificationSettingItem({
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontFamily: 'SpaceGrotesk',
          ),
        ),
        CustomSwitch(
          value: value,
          onChanged: onChanged,
        ),
      ],
    );
  }

  Widget _accountSettingItem({
    required String title,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    return ListTile(
      title: Text(
        title,
        style: TextStyle(
          color: isDestructive ? Colors.red : Colors.white,
          fontFamily: 'SpaceGrotesk',
        ),
      ),
      trailing: isDestructive
          ? null
          : const Icon(
              Icons.chevron_right,
              color: Color(0xFF92ADC9),
            ),
      onTap: onTap,
    );
  }
}
