class GroupRegistration {
  final String groupName;
  final String leaderName;
  final String id;
  bool isApproved;

  GroupRegistration({
    required this.groupName,
    required this.leaderName,
    required this.id,
    this.isApproved = false,
  });
}

class Subject {
  final String letter;
  final String title;

  Subject({
    required this.letter,
    required this.title,
  });
}

class CardState {
  final String letter;
  final String title;
  String? selectedByGroup;
  bool isRevealed;

  CardState({
    required this.letter,
    required this.title,
    this.selectedByGroup,
    this.isRevealed = false,
  });
}

class GameState {
  final List<GroupRegistration> pendingRegistrations;
  final List<GroupRegistration> approvedGroups;
  final List<CardState> cards;
  final List<String> subjects;

  GameState({
    List<GroupRegistration>? pendingRegistrations,
    List<GroupRegistration>? approvedGroups,
    List<CardState>? cards,
    List<String>? subjects,
  })  : pendingRegistrations = pendingRegistrations ?? [],
        approvedGroups = approvedGroups ?? [],
        cards = cards ?? [],
        subjects = subjects ?? const [
          'Le plan de gestion « PRISM »',
          'Le plan de gestion « Lean Six Sigma »',
          'Le plan de gestion « PMBOK »',
          'Le plan de gestion « Waterfall »',
          'Le plan de gestion « PRINCE 2 »',
          'Le plan de gestion « Agile »',
        ];

  void initializeGame() {
    cards.clear();
    final letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    final shuffledSubjects = List<String>.from(subjects);
    shuffledSubjects.shuffle();

    for (int i = 0; i < 6; i++) {
      cards.add(CardState(
        letter: letters[i],
        title: shuffledSubjects[i],
      ));
    }
  }
}
