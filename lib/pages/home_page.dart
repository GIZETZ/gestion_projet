import 'package:flutter/material.dart';
import '../models.dart';
import 'registration_page.dart';

class HomePage extends StatelessWidget {
  final GameState gameState;
  final VoidCallback onRegistrationSubmitted;

  const HomePage({super.key, required this.gameState, required this.onRegistrationSubmitted});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 36.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const Text(
                  'Gestion des Projets',
                  style: TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.bold,
                    color: Colors.deepPurple,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                const Text(
                  'Une application pour gérer l\'inscription des groupes, l\'approbation par l\'administrateur, et la sélection aléatoire des sujets.',
                  style: TextStyle(fontSize: 16, color: Colors.black87),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 20),

                // Feature card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [BoxShadow(color: Colors.grey.shade200, blurRadius: 8)],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Ce que fait l\'application', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      const Text(
                        '• Les chefs de groupe s\'inscrivent (nom + groupe)\n• L\'administrateur approuve ou refuse les inscriptions\n• Quand 6 groupes sont approuvés, l\'admin démarre le jeu\n• Les chefs choisissent une lettre (A-F) et la carte se retourne pour révéler le sujet',
                        style: TextStyle(fontSize: 14, color: Colors.grey),
                      ),
                      const SizedBox(height: 12),
                      if (gameState.pendingRegistrations.isNotEmpty || gameState.approvedGroups.isNotEmpty)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('${gameState.pendingRegistrations.length} en attente', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.deepPurple)),
                                const SizedBox(height: 4),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text('${gameState.approvedGroups.length} approuvés', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                                const SizedBox(height: 4),
                              ],
                            ),
                          ],
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 26),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => RegistrationPage(
                            gameState: gameState,
                            onRegistrationSubmitted: onRegistrationSubmitted,
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('S\'inscrire comme chef de groupe', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                ),

                const SizedBox(height: 12),

                // Admin button intentionally hidden; admin route remains accessible at /ithiel
                const SizedBox(height: 8),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
