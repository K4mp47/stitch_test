import 'package:flutter/material.dart';

class PlanTripScreen extends StatefulWidget {
  const PlanTripScreen({super.key});

  @override
  State<PlanTripScreen> createState() => _PlanTripScreenState();
}

class _PlanTripScreenState extends State<PlanTripScreen> {
  String _selectedVehicle = 'Car';

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
          'Plan a Safe Trip',
          style: TextStyle(
            color: Colors.white,
            fontFamily: 'SpaceGrotesk',
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Start Point
            TextField(
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.farsight_digital, color: Color(0xFF92ADC9)),
                hintText: 'Enter starting location',
                hintStyle: const TextStyle(color: Color(0xFF92ADC9), fontFamily: 'SpaceGrotesk'),
                filled: true,
                fillColor: const Color(0xFF192633),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.0),
                  borderSide: const BorderSide(color: Color(0xFF324D67)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.0),
                  borderSide: const BorderSide(color: Color(0xFF324D67)),
                ),
              ),
              style: const TextStyle(color: Colors.white, fontFamily: 'SpaceGrotesk'),
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerLeft,
              child: TextButton(
                onPressed: () {},
                child: const Text(
                  'Use my current location',
                  style: TextStyle(
                    color: Color(0xFF607AFB),
                    fontFamily: 'SpaceGrotesk',
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Destination
            TextField(
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.flag, color: Color(0xFF92ADC9)),
                hintText: 'Enter destination',
                hintStyle: const TextStyle(color: Color(0xFF92ADC9), fontFamily: 'SpaceGrotesk'),
                filled: true,
                fillColor: const Color(0xFF192633),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.0),
                  borderSide: const BorderSide(color: Color(0xFF324D67)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.0),
                  borderSide: const BorderSide(color: Color(0xFF324D67)),
                ),
              ),
              style: const TextStyle(color: Colors.white, fontFamily: 'SpaceGrotesk'),
            ),
            const SizedBox(height: 24),

            // Vehicle Selector
            const Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Select Vehicle Type',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'SpaceGrotesk',
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _vehicleButton(
                  icon: Icons.directions_car,
                  label: 'Car',
                  isSelected: _selectedVehicle == 'Car',
                  onTap: () => setState(() => _selectedVehicle = 'Car'),
                ),
                _vehicleButton(
                  icon: Icons.two_wheeler,
                  label: 'Motorcycle',
                  isSelected: _selectedVehicle == 'Motorcycle',
                  onTap: () => setState(() => _selectedVehicle = 'Motorcycle'),
                ),
                _vehicleButton(
                  icon: Icons.local_shipping,
                  label: 'Van',
                  isSelected: _selectedVehicle == 'Van',
                  onTap: () => setState(() => _selectedVehicle = 'Van'),
                ),
              ],
            ),
            const Spacer(),

            // Find Routes Button
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF607AFB),
                minimumSize: const Size(double.infinity, 56),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
              ),
              child: const Text(
                'Find Safe Routes',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16.0,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'SpaceGrotesk',
                ),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Routes are calculated based on real-time climate alerts.',
              style: TextStyle(
                color: Color(0xFF92ADC9),
                fontSize: 12.0,
                fontFamily: 'SpaceGrotesk',
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _vehicleButton({
    required IconData icon,
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 100,
        height: 100,
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF607AFB).withOpacity(0.2) : const Color(0xFF192633),
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(
            color: isSelected ? const Color(0xFF607AFB) : const Color(0xFF324D67),
            width: 2,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: isSelected ? const Color(0xFF607AFB) : const Color(0xFF92ADC9), size: 32.0),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? const Color(0xFF607AFB) : const Color(0xFF92ADC9),
                fontFamily: 'SpaceGrotesk',
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
