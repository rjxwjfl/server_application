// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

class Project {
  String title;
  String category;
  String description;
  String goal;
  DateTime start_on;
  DateTime expire_on;
  Project({
    required this.title,
    required this.category,
    required this.description,
    required this.goal,
    required this.start_on,
    required this.expire_on,
  });

  Project copyWith({
    String? title,
    String? category,
    String? description,
    String? goal,
    DateTime? start_on,
    DateTime? expire_on,
  }) {
    return Project(
      title: title ?? this.title,
      category: category ?? this.category,
      description: description ?? this.description,
      goal: goal ?? this.goal,
      start_on: start_on ?? this.start_on,
      expire_on: expire_on ?? this.expire_on,
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'title': title,
      'category': category,
      'description': description,
      'goal': goal,
      'start_on': start_on.millisecondsSinceEpoch,
      'expire_on': expire_on.millisecondsSinceEpoch,
    };
  }

  factory Project.fromMap(Map<String, dynamic> map) {
    return Project(
      title: map['title'] as String,
      category: map['category'] as String,
      description: map['description'] as String,
      goal: map['goal'] as String,
      start_on: DateTime.fromMillisecondsSinceEpoch(map['start_on'] as int),
      expire_on: DateTime.fromMillisecondsSinceEpoch(map['expire_on'] as int),
    );
  }

  String toJson() => json.encode(toMap());

  factory Project.fromJson(String source) => Project.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'Project(title: $title, category: $category, description: $description, goal: $goal, start_on: $start_on, expire_on: $expire_on)';
  }

  @override
  bool operator ==(covariant Project other) {
    if (identical(this, other)) return true;
  
    return 
      other.title == title &&
      other.category == category &&
      other.description == description &&
      other.goal == goal &&
      other.start_on == start_on &&
      other.expire_on == expire_on;
  }

  @override
  int get hashCode {
    return title.hashCode ^
      category.hashCode ^
      description.hashCode ^
      goal.hashCode ^
      start_on.hashCode ^
      expire_on.hashCode;
  }
}


class Feed{

}
