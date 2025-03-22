import os
import json

def ensure_directories():
    """Ensure the output directory exists"""
    os.makedirs("book_processing/output", exist_ok=True)
    print("Created directories for sample data")

def generate_sample_character_data():
    """Generate sample character data for 1984"""
    characters = [
        {
            "id": "1",
            "name": "Winston Smith",
            "aliases": ["Winston", "Smith", "Winston Smith", "Comrade Smith"],
            "mention_count": 458,
            "quote_count": 87,
            "gender": "male",
            "sample_quotes": [
                "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.",
                "War is peace. Freedom is slavery. Ignorance is strength.",
                "We shall meet in the place where there is no darkness.",
                "I hate purity, I hate goodness! I don't want any virtue to exist anywhere. I want everyone to be corrupt to the bones.",
                "Perhaps one did not want to be loved so much as to be understood.",
                "Being in a minority, even in a minority of one, did not make you mad. There was truth and there was untruth, and if you clung to the truth even against the whole world, you were not mad.",
                "If you want a picture of the future, imagine a boot stamping on a human face—for ever.",
                "The best books... are those that tell you what you know already.",
                "Until they become conscious they will never rebel, and until after they have rebelled they cannot become conscious.",
                "Sanity is not statistical."
            ],
            "mentions": [
                {"text": "Winston Smith", "type": "PROP", "start_token": "124", "end_token": "125"},
                {"text": "Winston", "type": "PROP", "start_token": "890", "end_token": "890"},
                {"text": "Smith", "type": "PROP", "start_token": "1202", "end_token": "1202"},
                {"text": "comrade", "type": "NOM", "start_token": "2301", "end_token": "2301"},
                {"text": "he", "type": "PRON", "start_token": "3405", "end_token": "3405"}
            ]
        },
        {
            "id": "2",
            "name": "Julia",
            "aliases": ["Julia", "the dark-haired girl"],
            "mention_count": 211,
            "quote_count": 52,
            "gender": "female",
            "sample_quotes": [
                "I love you.",
                "I'm good at spotting people who don't belong. As soon as I saw you I knew you were against THEM.",
                "I hate goodness. I want everyone to be corrupt to the bones.",
                "Look, I'm not literary. I'm not interested in books.",
                "It's the one thing they can't do. They can make you say anything—anything—but they can't make you believe it. They can't get inside you.",
                "If you kept the small rules, you could break the big ones.",
                "I'm not interested in the next generation, dear. I'm interested in us.",
                "I don't care about all that stuff. All I care about is us.",
                "I hate purity. I hate goodness. I want everyone to be corrupt to the bones.",
                "I'm only a rebel from the waist downwards."
            ],
            "mentions": [
                {"text": "Julia", "type": "PROP", "start_token": "567", "end_token": "567"},
                {"text": "dark-haired girl", "type": "NOM", "start_token": "789", "end_token": "791"},
                {"text": "the girl", "type": "NOM", "start_token": "1256", "end_token": "1257"},
                {"text": "she", "type": "PRON", "start_token": "2345", "end_token": "2345"}
            ]
        },
        {
            "id": "3",
            "name": "O'Brien",
            "aliases": ["O'Brien", "Comrade O'Brien"],
            "mention_count": 169,
            "quote_count": 65,
            "gender": "male",
            "sample_quotes": [
                "We shall meet in the place where there is no darkness.",
                "The object of persecution is persecution. The object of torture is torture. The object of power is power.",
                "Power is in tearing human minds to pieces and putting them together again in new shapes of your own choosing.",
                "If you want a picture of the future, imagine a boot stamping on a human face—for ever.",
                "How does one man assert his power over another, Winston? By making him suffer.",
                "Power is not a means; it is an end. One does not establish a dictatorship in order to safeguard a revolution; one makes the revolution in order to establish the dictatorship.",
                "The Party seeks power entirely for its own sake. We are not interested in the good of others; we are interested solely in power.",
                "Always, Winston, at every moment, there will be the thrill of victory, the sensation of trampling on an enemy who is helpless.",
                "You will be hollow. We shall squeeze you empty, and then we shall fill you with ourselves.",
                "Reality exists in the human mind, and nowhere else."
            ],
            "mentions": [
                {"text": "O'Brien", "type": "PROP", "start_token": "905", "end_token": "905"},
                {"text": "Comrade O'Brien", "type": "PROP", "start_token": "1078", "end_token": "1079"},
                {"text": "the man", "type": "NOM", "start_token": "2401", "end_token": "2402"},
                {"text": "he", "type": "PRON", "start_token": "3502", "end_token": "3502"}
            ]
        },
        {
            "id": "4",
            "name": "Big Brother",
            "aliases": ["Big Brother", "Leader"],
            "mention_count": 103,
            "quote_count": 0,
            "gender": "male",
            "sample_quotes": [],
            "mentions": [
                {"text": "Big Brother", "type": "PROP", "start_token": "145", "end_token": "146"},
                {"text": "Big Brother", "type": "PROP", "start_token": "950", "end_token": "951"},
                {"text": "the Leader", "type": "NOM", "start_token": "1578", "end_token": "1579"}
            ]
        },
        {
            "id": "5",
            "name": "Mr. Charrington",
            "aliases": ["Charrington", "Mr. Charrington", "the old man"],
            "mention_count": 42,
            "quote_count": 18,
            "gender": "male",
            "sample_quotes": [
                "You are the dead.",
                "It's beautiful, that is, I mean the steel is beautiful.",
                "There's another room upstairs that you might care to take a look at.",
                "It's a beautiful thing, coral, isn't it?",
                "It was a pale disc with a white figure at the center. Not exactly an engraving... it must be a hundred years old."
            ],
            "mentions": [
                {"text": "Mr. Charrington", "type": "PROP", "start_token": "3245", "end_token": "3246"},
                {"text": "Charrington", "type": "PROP", "start_token": "3678", "end_token": "3678"},
                {"text": "the old man", "type": "NOM", "start_token": "4120", "end_token": "4122"},
                {"text": "he", "type": "PRON", "start_token": "4590", "end_token": "4590"}
            ]
        }
    ]
    
    # Write character data to JSON file
    output_path = os.path.join("book_processing/output", "characters.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(characters, f, indent=2)
    
    print(f"Generated sample character data: {output_path}")
    return output_path

def generate_sample_theme_data():
    """Generate sample theme data for 1984"""
    themes = [
        {
            "name": "Totalitarianism",
            "keywords": ["big brother", "party", "government", "control", "watching", "surveillance"],
            "occurrence_count": 273,
            "evidence_sentence_ids": ["124", "567", "890", "1234", "5678"]
        },
        {
            "name": "Surveillance",
            "keywords": ["telescreen", "watching", "spying", "observe", "listen", "monitor"],
            "occurrence_count": 189,
            "evidence_sentence_ids": ["456", "789", "1011", "2345", "6789"]
        },
        {
            "name": "Psychological Manipulation",
            "keywords": ["doublethink", "newspeak", "thoughtcrime", "memory", "alter", "propaganda"],
            "occurrence_count": 156,
            "evidence_sentence_ids": ["321", "654", "987", "3456", "7890"]
        },
        {
            "name": "Rebellion",
            "keywords": ["resist", "rebel", "freedom", "fight", "against", "defy"],
            "occurrence_count": 124,
            "evidence_sentence_ids": ["135", "579", "1113", "4567", "8901"]
        },
        {
            "name": "Loss of Identity",
            "keywords": ["identity", "self", "individual", "personality", "conform", "vaporize"],
            "occurrence_count": 98,
            "evidence_sentence_ids": ["246", "680", "1224", "5678", "9012"]
        },
        {
            "name": "Historical Revisionism",
            "keywords": ["history", "memory", "change", "rewrite", "record", "ministry of truth"],
            "occurrence_count": 87,
            "evidence_sentence_ids": ["357", "791", "1335", "6789", "1234"]
        }
    ]
    
    # Write theme data to JSON file
    output_path = os.path.join("book_processing/output", "themes.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(themes, f, indent=2)
    
    print(f"Generated sample theme data: {output_path}")
    return output_path

def generate_sample_relationship_data():
    """Generate sample relationship data between characters"""
    relationships = [
        {
            "source": "1",
            "source_name": "Winston Smith",
            "target": "2",
            "target_name": "Julia",
            "type": "loves",
            "strength": 27
        },
        {
            "source": "2",
            "source_name": "Julia",
            "target": "1",
            "target_name": "Winston Smith",
            "type": "loves",
            "strength": 24
        },
        {
            "source": "1",
            "source_name": "Winston Smith",
            "target": "3",
            "target_name": "O'Brien",
            "type": "trusts/fears",
            "strength": 18
        },
        {
            "source": "3",
            "source_name": "O'Brien",
            "target": "1",
            "target_name": "Winston Smith",
            "type": "manipulates",
            "strength": 31
        },
        {
            "source": "1",
            "source_name": "Winston Smith",
            "target": "4",
            "target_name": "Big Brother",
            "type": "fears/hates",
            "strength": 19
        },
        {
            "source": "2",
            "source_name": "Julia",
            "target": "4",
            "target_name": "Big Brother",
            "type": "hates",
            "strength": 14
        },
        {
            "source": "1",
            "source_name": "Winston Smith",
            "target": "5",
            "target_name": "Mr. Charrington",
            "type": "trusts",
            "strength": 8
        },
        {
            "source": "5",
            "source_name": "Mr. Charrington",
            "target": "1",
            "target_name": "Winston Smith",
            "type": "betrays",
            "strength": 5
        },
        {
            "source": "3",
            "source_name": "O'Brien",
            "target": "4",
            "target_name": "Big Brother",
            "type": "serves",
            "strength": 12
        }
    ]
    
    # Write relationship data to JSON file
    output_path = os.path.join("book_processing/output", "relationships.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(relationships, f, indent=2)
    
    print(f"Generated sample relationship data: {output_path}")
    return output_path

def generate_sample_character_profiles():
    """Generate sample character profiles with enhanced details"""
    profiles = [
        {
            "id": "1",
            "name": "Winston Smith",
            "aliases": ["Winston", "Smith", "Winston Smith", "Comrade Smith"],
            "quote_count": 87,
            "mention_count": 458,
            "sample_quotes": [
                "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.",
                "We shall meet in the place where there is no darkness.",
                "Perhaps one did not want to be loved so much as to be understood.",
                "Being in a minority, even in a minority of one, did not make you mad.",
                "Until they become conscious they will never rebel, and until after they have rebelled they cannot become conscious."
            ],
            "gender": "male",
            "traits": ["rebellious", "intellectual", "introspective", "paranoid", "curious"],
            "role": "protagonist",
            "description": "Winston Smith is a low-ranking member of the ruling Party in London, in the nation of Oceania. Everywhere Winston goes, even his own home, the Party watches him through telescreens. He works at the Ministry of Truth, where he alters historical records to fit Party needs. He is haunted by memories he's uncertain of and is searching for truth amidst the Party's lies."
        },
        {
            "id": "2",
            "name": "Julia",
            "aliases": ["Julia", "the dark-haired girl"],
            "quote_count": 52,
            "mention_count": 211,
            "sample_quotes": [
                "I love you.",
                "I'm good at spotting people who don't belong. As soon as I saw you I knew you were against THEM.",
                "It's the one thing they can't do. They can make you say anything—anything—but they can't make you believe it.",
                "If you kept the small rules, you could break the big ones.",
                "I'm only a rebel from the waist downwards."
            ],
            "gender": "female",
            "traits": ["rebellious", "pragmatic", "sensual", "resourceful", "adaptable"],
            "role": "love interest/ally",
            "description": "Julia is a young woman who maintains an outward appearance of Party orthodoxy but secretly rebels by having affairs with Party members. She is less interested in intellectual rebellion than Winston and more focused on living life on her own terms within the existing system. She works in the Fiction Department of the Ministry of Truth."
        },
        {
            "id": "3",
            "name": "O'Brien",
            "aliases": ["O'Brien", "Comrade O'Brien"],
            "quote_count": 65,
            "mention_count": 169,
            "sample_quotes": [
                "The object of persecution is persecution. The object of torture is torture. The object of power is power.",
                "Power is in tearing human minds to pieces and putting them together again in new shapes of your own choosing.",
                "If you want a picture of the future, imagine a boot stamping on a human face—for ever.",
                "How does one man assert his power over another, Winston? By making him suffer.",
                "Power is not a means; it is an end."
            ],
            "gender": "male",
            "traits": ["intelligent", "calculating", "manipulative", "powerful", "loyal to Party"],
            "role": "antagonist",
            "description": "O'Brien is a high-ranking member of the Inner Party who poses as a member of the Brotherhood resistance movement. He initially gains Winston's trust but later reveals himself as an agent of the Thought Police. He is the embodiment of the Party's power and effectively serves as Winston's torturer and re-educator at the Ministry of Love."
        },
        {
            "id": "4",
            "name": "Big Brother",
            "aliases": ["Big Brother", "Leader"],
            "quote_count": 0,
            "mention_count": 103,
            "sample_quotes": [],
            "gender": "male",
            "traits": ["omnipresent", "authoritarian", "symbolic"],
            "role": "figurehead/symbol",
            "description": "Big Brother is the face of the Party and the figurehead of Oceania. He is described as a man with a mustache and represents the embodiment of the Party's power and authority. It is unclear if he actually exists as a person or is merely a fabrication of the Party to inspire loyalty and fear."
        },
        {
            "id": "5",
            "name": "Mr. Charrington",
            "aliases": ["Charrington", "Mr. Charrington", "the old man"],
            "quote_count": 18,
            "mention_count": 42,
            "sample_quotes": [
                "You are the dead.",
                "It's beautiful, that is, I mean the steel is beautiful.",
                "There's another room upstairs that you might care to take a look at."
            ],
            "gender": "male",
            "traits": ["deceptive", "patient", "observant"],
            "role": "hidden antagonist",
            "description": "Mr. Charrington appears to be an elderly shopkeeper in the prole district who rents a room above his shop to Winston and Julia for their secret meetings. He presents himself as a sympathetic figure interested in antiques and the past, but is ultimately revealed to be a member of the Thought Police who has been monitoring them."
        }
    ]
    
    # Write character profiles to JSON file
    output_path = os.path.join("book_processing/output", "character_profiles.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(profiles, f, indent=2)
    
    print(f"Generated sample character profiles: {output_path}")
    return output_path

def generate_all_sample_data():
    """Generate all sample data files"""
    ensure_directories()
    generate_sample_character_data()
    generate_sample_theme_data()
    generate_sample_relationship_data()
    generate_sample_character_profiles()
    print("All sample data files generated successfully.")

if __name__ == "__main__":
    generate_all_sample_data()