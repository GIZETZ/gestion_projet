import 'package:flutter/material.dart';
import '../models.dart';

class AdminPage extends StatefulWidget {
  final GameState gameState;
  final VoidCallback onStateChanged;
  final VoidCallback onGameStarted;

  const AdminPage({
    super.key,
    required this.gameState,
    required this.onStateChanged,
    required this.onGameStarted,
  });

  @override
  State<AdminPage> createState() => _AdminPageState();
}

class _AdminPageState extends State<AdminPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Administration'),
        centerTitle: true,
        backgroundColor: Colors.red.shade700,
      ),
      body: Column(
        children: [
          Container(
            color: Colors.red.shade700,
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Gestion des Inscriptions',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'En attente: ${widget.gameState.pendingRegistrations.length} | Approuvés: ${widget.gameState.approvedGroups.length}',
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: widget.gameState.pendingRegistrations.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.check_circle,
                          size: 64,
                          color: Colors.green.shade400,
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Aucune inscription en attente',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: widget.gameState.pendingRegistrations.length,
                    itemBuilder: (context, index) {
                      final registration =
                          widget.gameState.pendingRegistrations[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Chef: ${registration.leaderName}',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Groupe: ${registration.groupName}',
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceEvenly,
                                children: [
                                  ElevatedButton(
                                    onPressed: () =>
                                        _approveRegistration(registration),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.green,
                                    ),
                                    child: const Padding(
                                      padding: EdgeInsets.symmetric(
                                        horizontal: 20,
                                      ),
                                      child: Text(
                                        'Approuver',
                                        style: TextStyle(
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ),
                                  ElevatedButton(
                                    onPressed: () =>
                                        _rejectRegistration(registration),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.red,
                                    ),
                                    child: const Padding(
                                      padding: EdgeInsets.symmetric(
                                        horizontal: 20,
                                      ),
                                      child: Text(
                                        'Refuser',
                                        style: TextStyle(
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
          if (widget.gameState.approvedGroups.isNotEmpty)
            Container(
              color: Colors.grey.shade200,
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Groupes approuvés',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: widget.gameState.approvedGroups
                        .map(
                          (group) => Chip(
                            label: Text(group.groupName),
                            avatar: const Icon(Icons.check),
                          ),
                        )
                        .toList(),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: widget.gameState.approvedGroups.length == 6
                          ? _startGame
                          : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                        disabledBackgroundColor: Colors.grey,
                      ),
                      child: Text(
                        widget.gameState.approvedGroups.length == 6
                            ? 'Démarrer le jeu'
                            : 'En attente de ${6 - widget.gameState.approvedGroups.length} groupe(s)',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  void _approveRegistration(GroupRegistration registration) {
    setState(() {
      widget.gameState.pendingRegistrations.remove(registration);
      registration.isApproved = true;
      widget.gameState.approvedGroups.add(registration);
    });
    widget.onStateChanged();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${registration.groupName} approuvé'),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _rejectRegistration(GroupRegistration registration) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Confirmer le refus'),
          content: Text(
            'Êtes-vous sûr de vouloir refuser ${registration.groupName}?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Annuler'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                setState(() {
                  widget.gameState.pendingRegistrations.remove(registration);
                });
                widget.onStateChanged();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('${registration.groupName} refusé'),
                    backgroundColor: Colors.red,
                    duration: const Duration(seconds: 2),
                  ),
                );
              },
              child: const Text('Refuser'),
            ),
          ],
        );
      },
    );
  }

  void _startGame() {
    widget.gameState.initializeGame();
    widget.onGameStarted();
    Navigator.of(context).pushNamedAndRemoveUntil('/', (route) => false);
    widget.onStateChanged();
  }
}
