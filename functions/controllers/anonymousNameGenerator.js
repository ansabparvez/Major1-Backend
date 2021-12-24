var names = Object.freeze(["Aligator", "Anteater", "Armadillo", "Aurochs", "Axolotl", "Badger", "Bat", "Beaver", "Buffalo", "Camel", "Capybara", "Chameleon",
"Cheetah", "Chinchilla", "Chipmunk", "Chupacabra", "Cormorant", "Coyote", "Crow", "Dingo", "Dinosaur", "Dolphin", "Duck", "Elephant", "Ferret", "Fox", "Frog",
"Giraffe", "Gopher", "Grizzly", "Hedgehog", "Hippo", "Hyena", "Ibex", "Ifrit", "Iguana", "Jackal", "Jackalope", "Kangaroo", "Koala", "Kraken", "Lemur", "Leopard",
"Liger", "Llama", "Manatee", "Mink", "Monkey", "Moose", "Narwhal", "Nyan Cat", "Orangutan","Otter", "Panda", "Penguin", "Platypus", "Pumpkin", "Python", "Quagga", 
"Rabbit", "Raccoon", "Rhino", "Sheep", "Shrew", "Skunk", "Slow Loris", "Squirrel", "Tiger", "Turtle", "Walrus", "Wolf", "Wolverine", "Wombat"])

exports.randomName = function getRandomUserName(){
    return names[Math.floor(Math.random() * names.length)];
}