import 'package:flutter/material.dart';

class AlertDetailsScreen extends StatelessWidget {
  const AlertDetailsScreen({super.key});

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
          'Allerta Alluvione',
          style: TextStyle(
            color: Colors.white,
            fontFamily: 'SpaceGrotesk',
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share, color: Colors.white),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Chips
              Row(
                children: [
                  Chip(
                    backgroundColor: const Color(0xFFD32F2F),
                    label: const Text(
                      'Gravità Alta',
                      style: TextStyle(color: Colors.white, fontFamily: 'SpaceGrotesk'),
                    ),
                    avatar: const Icon(Icons.warning, color: Colors.white),
                  ),
                  const SizedBox(width: 8),
                  Chip(
                    backgroundColor: const Color(0xFF607AFB).withOpacity(0.2),
                    label: const Text(
                      'Bologna, Italia',
                      style: TextStyle(color: Colors.white, fontFamily: 'SpaceGrotesk'),
                    ),
                    avatar: const Icon(Icons.location_on, color: Colors.white),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Map Snippet
              Container(
                height: 200,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12.0),
                  image: const DecorationImage(
                    image: NetworkImage(
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuBeiTRoL0DIxo2zqQLots5_qlDvrvolDJCFI5wYm5gUU6FD22AFJdU7hnG7pi75hhZSy0z-wIw22TU_yi12X5RsFtlTlipHAuMoasmkPhN0VFjfTVcSV45GRYUKzECRoYrdOYT-AAbMwPpwVI9pFad-aC98kl1C973fzFdpqcbL1xN92AyJ13Y8HerS6bBQsu5tdznpBFKo8ByH-Qzxj_ThpzFCrh8xRtpG9fFZhTo7S2ABfWpo-Mf1x-gsA2A0ESHPzlruzGzXZbjb'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Information Card
              Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Bologna, Zona Nord',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'SpaceGrotesk',
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Aggiornato alle 14:30',
                      style: TextStyle(
                        color: Color(0xFF92ADC9),
                        fontFamily: 'SpaceGrotesk',
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Le forti piogge hanno causato l\'esondazione del fiume Reno, interessando le aree a nord della città. Le autorità consigliano di evitare tutti gli spostamenti non essenziali.',
                      style: TextStyle(
                        color: Colors.white70,
                        fontFamily: 'SpaceGrotesk',
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Safety Advice
              const Text(
                'Consigli di Sicurezza',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'SpaceGrotesk',
                ),
              ),
              const SizedBox(height: 16),
              _safetyAdviceItem(
                icon: Icons.directions_car,
                text: 'Non attraversare strade allagate.',
              ),
              const SizedBox(height: 8),
              _safetyAdviceItem(
                icon: Icons.landscape,
                text: 'Cerca un terreno più elevato se ti trovi in una zona a rischio.',
              ),
              const SizedBox(height: 8),
              _safetyAdviceItem(
                icon: Icons.campaign,
                text: 'Segui le indicazioni delle autorità locali.',
              ),
              const SizedBox(height: 24),

              // Alternative Route
              const Text(
                'Percorso Alternativo',
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
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Row(
                  children: [
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Il tuo percorso è stato modificato per evitare la zona di pericolo.',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'SpaceGrotesk',
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Tempo di viaggio aggiuntivo stimato: +15 min',
                            style: TextStyle(
                              color: Color(0xFF92ADC9),
                              fontFamily: 'SpaceGrotesk',
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12.0),
                        image: const DecorationImage(
                          image: NetworkImage(
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuDP5XL2ZelGQXxZeDu9kpHpU-MBQ7u4oD38SehWgYm82trCyv5jFDgV69e4ilfrT7t1JReArOlxERB7sZK0pdDRHyWnGwkgbE2MeaWqets5wWrTWWYSU9wBCbu2CsaRNMhdpXQ57CmCmylnd9-xQu4fUPUmOHnOFHMO-i_TpakJ52F46029tNWix6TrUJTlQj_kfJhDCXGVAY6eiHHH4mA5Eh8VRKmbpnRRh26tbqL7jUFTbpDcNCmXA_wUIURlw6-ecqHiPIf1T4lr'),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Safe Rest Areas
              const Text(
                'Aree di Sosta Sicure',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'SpaceGrotesk',
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 120,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _safeRestAreaItem(
                      icon: Icons.local_gas_station,
                      title: 'Stazione di Servizio A1',
                      subtitle: 'Aperta 24/7. Area ristoro disponibile.',
                      distance: '5 km',
                    ),
                    const SizedBox(width: 16),
                    _safeRestAreaItem(
                      icon: Icons.meeting_room,
                      title: 'Centro Civico Casalecchio',
                      subtitle: 'Rifugio pubblico temporaneo.',
                      distance: '8 km',
                    ),
                    const SizedBox(width: 16),
                    _safeRestAreaItem(
                      icon: Icons.local_parking,
                      title: 'Parcheggio Fiera',
                      subtitle: 'Area sicura designata per la sosta.',
                      distance: '12 km',
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        label: const Text(
          'Mostra Percorso Sicuro',
          style: TextStyle(fontFamily: 'SpaceGrotesk', fontWeight: FontWeight.bold),
        ),
        icon: const Icon(Icons.route),
        backgroundColor: const Color(0xFF607AFB),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  Widget _safetyAdviceItem({required IconData icon, required String text}) {
    return Row(
      children: [
        CircleAvatar(
          backgroundColor: const Color(0xFF607AFB).withOpacity(0.2),
          child: Icon(icon, color: const Color(0xFF607AFB)),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              color: Colors.white,
              fontFamily: 'SpaceGrotesk',
            ),
          ),
        ),
      ],
    );
  }

  Widget _safeRestAreaItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required String distance,
  }) {
    return Container(
      width: 200,
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: Colors.green,
                child: Icon(icon, color: Colors.white),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'SpaceGrotesk',
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: const TextStyle(
              color: Color(0xFF92ADC9),
              fontFamily: 'SpaceGrotesk',
            ),
          ),
          const Spacer(),
          Text(
            'Distanza: $distance',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontFamily: 'SpaceGrotesk',
            ),
          ),
        ],
      ),
    );
  }
}
