import React from 'react';
import {View,Text,ScrollView,  TextInput, StyleSheet, Button, Dimensions} from 'react-native';
import axios from 'axios';
import PlayAudio from './PlayAudio';

//key for oxford authentification
const keyApi = 'c7d0f176f1b156cb19ee20fd5b7d5aca';

//id for oxford authentification
const appId = 'e853a02e';

//Setting the key and id in the headers of axios
axios.defaults.headers.common["app_id"] = appId;
axios.defaults.headers.common["app_key"] = keyApi;

//Class containing all the functions of the dictionary/thesaurus
class Dictionary extends React.Component {

    //Initializing
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            meaningText: '',
            exampleText: '',
            audioFile: '',
            synonymsText: '',
            antonymsText: '',
            found: false
        } 
    }

    componentDidMount() {

    }

    //function to search for an example sentence for a given word
    searchExample = async() => { {
        const endpoint = 'sentences';

        const url = 'https://od-api.oxforddictionaries.com/api/v2/' + endpoint  + '/en/' + this.state.searchText;
        try{
            let response = await axios.get(url);
            let sentence = response.data.results[0].lexicalEntries[0].sentences[0].text +'\n';
            this.setState({exampleText: sentence});
        }
        catch(error){
            this.setState({exampleText: 'Example not found!'});
             }
    }    
    }

    //function to search for synonyms for a given word
    searchSynonyms = async(response) => { {
        try{
            let synonyms = response.data.results[0].lexicalEntries[0].entries[0].senses[0].synonyms;
            
            let synonym = '';
            
            synonyms.forEach((element) => {
                synonym += element.text + ', '
            });
            synonym = synonym.slice(0,-2);
            synonym += '\n';
            this.setState({synonymsText: synonym});
        }
        catch(error){
            this.setState({synonymsText: 'Synonym not found!'});
            }
    }
    }

    //function to search for antonyms for a given word
    searchAntonym = async(response) => { {

        try{

            let antonyms = response.data.results[0].lexicalEntries[0].entries[0].senses[0].antonyms;
            
            let antonym = '';
            
           
            antonyms.forEach((element) => {
                antonym += element.text + ', '
                
            });

            antonym = antonym.slice(0,-2);
            antonym += '\n';
            this.setState({antonymsText: antonym});
        }
        catch(error){
            this.setState({antonymsText: 'Antonym not found!' + '\n'});
            }
    }
    }

    //function to search for synonyms and antonyms for a given word
    searchThesaurus = async() => { {
        const endpoint = 'thesaurus';

        const url = 'https://od-api.oxforddictionaries.com/api/v2/' + endpoint  + '/en/' + this.state.searchText  ;
        try{
            
            let response = await axios.get(url); 
            this.searchSynonyms(response);
            this.searchAntonym(response); 
        }
        catch(error){
            this.setState({synonymsText: 'Synonym not found!'});
            this.setState({antonymsText: 'Antonym not found!' + '\n'});
            }
    }}

    //function to search for the definitions of a given word 
    //It also gets the link for the audio file containing the pronunciation of the word
    searchDefinition = async() => { {

        this.setState({found: false});
        let endpoint = 'entries';
        let definitions ='';
        let url = 'https://od-api.oxforddictionaries.com/api/v2/' + endpoint  + '/en-us/' + this.state.searchText;
        try{
            let response = await axios.get(url);
            let word = response.data.results[0].lexicalEntries[0].entries[0].senses;
            let audio = response.data.results[0].lexicalEntries[0].entries[0].pronunciations[1].audioFile;
            let definition = '';
            word.forEach((element, i) => {
             definition += (i + 1)+ '. ' + element.definitions[0] +'\n\n';
            
         });
            definition = definition.slice(0,-1);
            definitions =  definition;
            this.setState({found: true})
            this.setState({meaningText: definitions});
            this.setState({audioFile: audio});
            this.searchExample();
            this.searchThesaurus();
        }
        catch(error){
            this.setState({meaningText: 'Word not found!'});
             }
    }
}

    render() {

        //Returning the contents of the dictionary app
        return(

                //A ScrollView Component to view all the contents smoothly
                <ScrollView style={styles.app} contentContainerStyle={styles.container} endFillColor="lavender">
                    
                    {/**Displaying the title*/}
                    <View style={styles.title}>
                        <Text style={styles.titleText}>Dictionary and Thesaurus</Text>
                    </View>

                    {/**Displaying a box where user can enter a word that is to be searched */}
                    <TextInput style={styles.input}
                    onChangeText={(value)=>{
                        this.setState({searchText: value})
                    }}
                    value={this.state.searchText}
                    placeholder="Type a word"
                    />
                    
                    {/**Displaying a button to search the details of a word*/}
                    <View style={styles.button}>
                        <Button 
                            title="Search"
                            color="#663399"
                            onPress={()=>{this.searchDefinition();}}
                        />
                    </View>  
                    
                    {/**Displaying the word that is to be searched */}
                    <>
                        {this.state.found?(<Text style={styles.wordText}>{this.state.searchText.toLowerCase()}</Text>):null}
                    </>

                    {/**Displaying the PlayButton for the pronunciation audio file of the word*/}
                    <View style ={styles.playButton}>
                        {this.state.found?(<PlayAudio url={this.state.audioFile}></PlayAudio>):null}
                    </View>


                    {/**Displaying the meaning, example, synonym and antonym of the given word*/}
                    <View>
                        <>
                        {this.state.found?(<>
                            <Text style={styles.definitionText}>{this.state.meaningText}</Text>
                            <Text style ={styles.headingText}>Example:</Text>  
                            <Text style={styles.searchResultText}>{this.state.exampleText}</Text>
                            <Text style ={styles.headingText}>Synonyms:</Text>
                            <Text style={styles.searchResultText}>{this.state.synonymsText}</Text>
                            <Text style ={styles.headingText}>Antonyms:</Text>
                            <Text style={styles.searchResultText}>{this.state.antonymsText}</Text></>):
                        <Text style={styles.searchResultText}>{this.state.meaningText}</Text>}
                        </>  
                     </View>
            </ScrollView>
            
        );
    }
}

//Styles
styles = StyleSheet.create({
    
    //Style for the ScrollView
    app: {
        maxHeight: (Dimensions.get('window').height)-25,
        backgroundColor: 'lavender',
        alignSelf: 'center'
    },
    //Style for the contentContainer of ScrollView
    container: {
        justifyContent: 'center',
        paddingTop: 20 
    },
    //Style for the TextInput when searching a word
    input: {
        borderColor: 'rebeccapurple',
        height: 40,
        margin: 12,
        borderWidth: 1,
        paddingLeft: 5
    },
    //Style for the search button
    button: {
        height: 40,
        margin: 12,
        backgroundColor: 'lavender',
    },
    //Style for the title
    titleText: {
        marginLeft: 5,
        marginRight: 5,
        fontWeight: 'bold',
        fontSize: 30,
        color: 'rebeccapurple'
    },
    //Style for the definition of the word
    definitionText: {
        marginHorizontal: 20
    },
    //Style for the word to be searched
    wordText: {
        marginHorizontal: 20,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#6624a8' 
    },
    //Style for the headings
    headingText: {
        marginHorizontal: 20,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#a70be0'
    },
    //Style for the contents
    searchResultText: {
        marginHorizontal: 30
    },
    //Style for the button for the audio
    playButton: {
        width: 40,
        height: 40,
        marginTop: 10,
        marginLeft: 25,
        marginBottom: 10
    }

});

export default Dictionary;