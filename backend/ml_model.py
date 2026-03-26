import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

MODEL_PATH = "news_model.pkl"
VEC_PATH = "vectorizer.pkl"

def train_model():
    texts = [
        "Government announces new education policy",
        "Sports team wins championship after thrilling match",
        "Breaking: Celebrity involved in scandal",
        "Fake news: Aliens landed in India yesterday",
        "Fake news: Cure cancer by drinking salt water"
    ]

    labels = [0, 0, 0, 1, 1]  # 0=Real, 1=Fake

    vectorizer = TfidfVectorizer(stop_words="english")
    X = vectorizer.fit_transform(texts)

    model = LogisticRegression()
    model.fit(X, labels)

    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VEC_PATH)

    print("✅ Model trained & saved successfully.")

def predict_fake(content):
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VEC_PATH)

    X = vectorizer.transform([content])
    prediction = model.predict(X)[0]

    return int(prediction)