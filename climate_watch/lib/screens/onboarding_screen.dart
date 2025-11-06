import 'package:climate_watch/screens/create_account_screen.dart';
import 'package:climate_watch/screens/login_screen.dart';
import 'package:climate_watch/widgets/feature_card.dart';
import 'package:flutter/material.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F1323),
      body: SafeArea(
        child: Column(
          children: [
            // Header
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 24.0, horizontal: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.shield, color: Color(0xFF607AFB), size: 32.0),
                  SizedBox(width: 8.0),
                  Text(
                    'ClimateSafe',
                    style: TextStyle(
                      color: Color(0xFF607AFB),
                      fontSize: 28.0,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'SpaceGrotesk',
                    ),
                  ),
                ],
              ),
            ),

            // Headline
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
              child: Text(
                'Viaggia sicuro, informato sul clima',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 32.0,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'SpaceGrotesk',
                ),
              ),
            ),

            // Carousel
            Expanded(
              child: PageView(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                children: const [
                  FeatureCard(
                    icon: Icons.notifications_active,
                    title: 'Allerte in tempo reale',
                    description: 'Ricevi notifiche immediate sulle emergenze climatiche.',
                  ),
                  FeatureCard(
                    icon: Icons.route,
                    title: 'Percorsi sicuri',
                    description: 'Pianifica i tuoi spostamenti evitando le aree a rischio.',
                  ),
                  FeatureCard(
                    icon: Icons.emergency_home,
                    title: 'Monitoraggio emergenze',
                    description: 'Tieni traccia degli eventi climatici importanti in corso.',
                  ),
                ],
              ),
            ),

            // Page Indicators
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(3, (index) {
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4.0),
                  width: 8.0,
                  height: 8.0,
                  decoration: BoxDecoration(
                    color: _currentPage == index ? const Color(0xFF607AFB) : const Color(0xFF324D67),
                    shape: BoxShape.circle,
                  ),
                );
              }),
            ),

            // CTA Section
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const CreateAccountScreen()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF607AFB),
                      minimumSize: const Size(double.infinity, 56),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                    ),
                    child: const Text(
                      'Crea Account',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'SpaceGrotesk',
                      ),
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Hai già un account?',
                        style: TextStyle(
                          color: Color(0xFF92ADC9),
                          fontFamily: 'SpaceGrotesk',
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                           Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const LoginScreen()),
                          );
                        },
                        child: const Text(
                          'Accedi',
                          style: TextStyle(
                            color: Color(0xFF607AFB),
                            fontWeight: FontWeight.bold,
                            fontFamily: 'SpaceGrotesk',
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
