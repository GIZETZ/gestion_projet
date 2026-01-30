import 'package:flutter/material.dart';
import 'models.dart';
import 'pages/home_page.dart';
import 'pages/admin_page.dart';
import 'pages/game_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late GameState _gameState;
  bool _gameStarted = false;

  @override
  void initState() {
    super.initState();
    _gameState = GameState();
  }

  void _onStateChanged() {
    setState(() {});
  }

  void _onGameStarted() {
    setState(() {
      _gameStarted = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Use the browser path as the initial route so direct navigation works (e.g. /ithiel)
    final initialRoute = Uri.base.path.isEmpty ? '/' : Uri.base.path;

    return MaterialApp(
      title: 'Gestion des Projets',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: initialRoute,
      routes: {
        '/': (context) => !_gameStarted
            ? HomePage(
                gameState: _gameState,
                onRegistrationSubmitted: _onStateChanged,
              )
            : GamePage(gameState: _gameState),
        '/ithiel': (context) => AdminPage(
              gameState: _gameState,
              onStateChanged: _onStateChanged,
              onGameStarted: _onGameStarted,
            ),
      },
      navigatorObservers: [
        _RegistrationRouteObserver(_onStateChanged),
      ],
    );
  }
}

class _RegistrationRouteObserver extends NavigatorObserver {
  final VoidCallback onRouteChange;

  _RegistrationRouteObserver(this.onRouteChange);

  @override
  void didPush(Route route, Route? previousRoute) {
    WidgetsBinding.instance.addPostFrameCallback((_) => onRouteChange());
  }

  @override
  void didPop(Route route, Route? previousRoute) {
    WidgetsBinding.instance.addPostFrameCallback((_) => onRouteChange());
  }
}
