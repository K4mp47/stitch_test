import 'package:climate_watch/screens/login_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CreateAccountScreen extends StatefulWidget {
  const CreateAccountScreen({super.key});

  @override
  State<CreateAccountScreen> createState() => _CreateAccountScreenState();
}

class _CreateAccountScreenState extends State<CreateAccountScreen> {
  bool _passwordVisible = false;
  bool _confirmPasswordVisible = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F1323),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              // Header
              const Icon(Icons.travel_explore, color: Color(0xFF607AFB), size: 48.0),
              const SizedBox(height: 16.0),
              const Text(
                'Crea un nuovo account',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28.0,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'SpaceGrotesk',
                ),
              ),
              const SizedBox(height: 8.0),
              const Text(
                'Registrati per monitorare il clima e viaggiare in sicurezza.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Color(0xFF92ADC9),
                  fontSize: 16.0,
                  fontFamily: 'SpaceGrotesk',
                ),
              ),
              const SizedBox(height: 40),

              // Email Field
              TextField(
                decoration: InputDecoration(
                  labelText: 'Email',
                  labelStyle: const TextStyle(color: Colors.white, fontFamily: 'SpaceGrotesk'),
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
              const SizedBox(height: 16.0),

              // Password Field
              TextField(
                obscureText: !_passwordVisible,
                decoration: InputDecoration(
                  labelText: 'Password',
                  labelStyle: const TextStyle(color: Colors.white, fontFamily: 'SpaceGrotesk'),
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
                  suffixIcon: IconButton(
                    icon: Icon(
                      _passwordVisible ? Icons.visibility : Icons.visibility_off,
                      color: const Color(0xFF92ADC9),
                    ),
                    onPressed: () {
                      setState(() {
                        _passwordVisible = !_passwordVisible;
                      });
                    },
                  ),
                ),
                style: const TextStyle(color: Colors.white, fontFamily: 'SpaceGrotesk'),
              ),
              const SizedBox(height: 16.0),

              // Confirm Password Field
              TextField(
                obscureText: !_confirmPasswordVisible,
                decoration: InputDecoration(
                  labelText: 'Conferma Password',
                  labelStyle: const TextStyle(color: Colors.white, fontFamily: 'SpaceGrotesk'),
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
                  suffixIcon: IconButton(
                    icon: Icon(
                      _confirmPasswordVisible ? Icons.visibility : Icons.visibility_off,
                      color: const Color(0xFF92ADC9),
                    ),
                    onPressed: () {
                      setState(() {
                        _confirmPasswordVisible = !_confirmPasswordVisible;
                      });
                    },
                  ),
                ),
                style: const TextStyle(color: Colors.white, fontFamily: 'SpaceGrotesk'),
              ),
              const SizedBox(height: 24.0),

              // Create Account Button
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
                  'Crea Account',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16.0,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'SpaceGrotesk',
                  ),
                ),
              ),
              const SizedBox(height: 24.0),

              // Divider
              const Row(
                children: [
                  Expanded(child: Divider(color: Color(0xFF324D67))),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.0),
                    child: Text(
                      'Oppure continua con',
                      style: TextStyle(color: Color(0xFF92ADC9), fontFamily: 'SpaceGrotesk'),
                    ),
                  ),
                  Expanded(child: Divider(color: Color(0xFF324D67))),
                ],
              ),
              const SizedBox(height: 24.0),

              // Social Login Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _socialLoginButton(imagePath: 'assets/google.png'),
                  const SizedBox(width: 16.0),
                  _socialLoginButton(imagePath: 'assets/apple.svg', isSvg: true),
                  const SizedBox(width: 16.0),
                  _socialLoginButton(imagePath: 'assets/facebook.png'),
                ],
              ),
              const SizedBox(height: 24.0),

              // Login Link
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
                      Navigator.pushReplacement(
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
      ),
    );
  }

  Widget _socialLoginButton({required String imagePath, bool isSvg = false}) {
    return ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF192633),
        shape: const CircleBorder(),
        padding: const EdgeInsets.all(16.0),
        side: const BorderSide(color: Color(0xFF324D67)),
      ),
      child: isSvg
          ? SvgPicture.asset(imagePath, height: 24.0, color: Colors.white)
          : Image.asset(imagePath, height: 24.0),
    );
  }
}
