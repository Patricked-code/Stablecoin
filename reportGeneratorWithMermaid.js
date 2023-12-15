const fs = require('fs');
const path = require('path');


/**
 * Fonction pour récupérer les détails d'un fichier ou d'un dossier.
 * @param {string} itemPath - Chemin de l'élément pour lequel obtenir des détails.
 * @returns {Object} - Objet contenant la taille, la date de modification et les permissions.
 */
 function getFileDetails(itemPath) {
    // Statistiques du système de fichiers pour l'élément
    const stats = fs.statSync(itemPath);
    return {
      size: stats.size, // Taille du fichier en octets
      modifiedTime: stats.mtime, // Timestamp de la dernière modification
      permissions: `0${(stats.mode & 0o777).toString(8)}` // Permissions du fichier en format Unix
    };
  }
  // *******************************************
  
  /**
   * Parcourt récursivement l'arborescence des dossiers à partir d'un chemin donné et génère une représentation textuelle.
   * @param {string} dirPath - Chemin du dossier à parcourir.
   * @param {number} depth - Niveau d'indentation pour refléter la structure hiérarchique.
   * @param {RegExp} excludePattern - Expression régulière définissant les éléments à exclure.
   * @returns {string} - Représentation textuelle de la structure du dossier.
   */
   function walkDirectory(dirPath, depth = 0, excludePattern = /(^|\/)\.[^\/\.]/g) {
      // Résultat initial vide
      let result = '';
    
      // Lecture du contenu du dossier
      const items = fs.readdirSync(dirPath);
    
      // Itération sur chaque élément du dossier
      items.forEach(item => {
        // Chemin complet de l'élément
        const fullPath = path.join(dirPath, item);
    
        // Ignorer les éléments qui correspondent au motif d'exclusion
        if (excludePattern.test(fullPath)) {
          return;
        }
    
        // Obtenir les détails de l'élément
        const details = getFileDetails(fullPath);
    
        // Construction de la ligne de résultat avec indentation, nom de l'élément et détails
        result += `${' '.repeat(depth * 4)}${item} (Size: ${details.size} bytes, Modified: ${details.modifiedTime.toLocaleString()}, Permissions: ${details.permissions})\n`;
    
        // Si l'élément est un dossier, appel récursif à la fonction pour son contenu
        if (fs.statSync(fullPath).isDirectory()) {
          result += walkDirectory(fullPath, depth + 1, excludePattern);
        }
      });
    
      return result;
    }
  // ***************************************************
  
  /**
   * Analyse la structure MVC du projet, en recherchant les dossiers de modèles, vues, contrôleurs et routes.
   * @param {string} projectRoot - Chemin racine du projet.
   * @returns {string} - Rapport détaillé de la structure MVC.
   */
   function analyzeMvcStructure(projectRoot) {
      // Composants MVC à rechercher
      const mvcComponents = ['models', 'views', 'controllers', 'routes'];
      let mvcReport = 'MVC Structure Report:\n';
    
      // Parcourir chaque composant MVC
      mvcComponents.forEach(component => {
        const componentPath = path.join(projectRoot, component);
    
        // Vérifier si le dossier du composant existe
        if (fs.existsSync(componentPath)) {
          mvcReport += `Found ${component} directory.\n`;
          // Utiliser la fonction walkDirectory pour obtenir la structure de ce dossier
          mvcReport += walkDirectory(componentPath, 1);
        } else {
          mvcReport += `No ${component} directory found.\n`;
        }
      });
    
      return mvcReport;
    }
  //   ******************************************************
  
  /**
   * Lit la section des scripts du fichier package.json et crée un rapport.
   * @param {string} projectRoot - Chemin racine du projet.
   * @returns {string} - Rapport des scripts.
   */
   function reportPackageJsonScripts(projectRoot) {
      const packageJsonPath = path.join(projectRoot, 'package.json');
      let scriptsReport = 'package.json Scripts Report:\n';
    
      // Vérifier l'existence du fichier package.json
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
        // Extraire et rapporter chaque script
        if (packageJson.scripts) {
          for (const [script, command] of Object.entries(packageJson.scripts)) {
            scriptsReport += `${script}: ${command}\n`;
          }
        } else {
          scriptsReport += 'No scripts found.\n';
        }
      } else {
        scriptsReport += 'package.json not found.\n';
      }
    
      return scriptsReport;
    }
    
  
  /**
   * Combinaison des différentes parties du rapport pour créer un rapport complet du projet.
   * @returns {string} - Rapport complet du projet.
   */
   function createCompleteReport() {
    const projectRoot = path.resolve(__dirname);
  
    // Remplacer generateProjectStructure par walkDirectory avec les paramètres nécessaires
    const structureReport = walkDirectory(projectRoot, 0, /(^|\/)\.[^\/\.]/g);
    
    // Analyser la structure MVC
    const mvcReport = analyzeMvcStructure(projectRoot);
    
    // Rapporter les scripts de package.json
    const packageScriptsReport = reportPackageJsonScripts(projectRoot);
  
    // Combinaison de tous les rapports
    const fullReport = `Project Structure Report:\n${structureReport}\n${mvcReport}\n${packageScriptsReport}`;
    return fullReport;
  }
    
    // Génération et écriture du rapport complet dans un fichier texte
    const fullReport = createCompleteReport();
    const reportFilePath = path.join(__dirname, 'full-project-report.txt');
    fs.writeFileSync(reportFilePath, fullReport, 'utf8');
    console.log(`Full project report saved to ${reportFilePath}`);


/**
 * Génère une représentation Mermaid.js de la structure du projet.
 * @param {string} dirPath - Chemin du dossier à parcourir.
 * @param {string} parentId - Identifiant du parent dans la structure Mermaid.
 * @param {number} depth - Profondeur actuelle dans l'arborescence.
 * @returns {string} - Représentation Mermaid.js de la structure.
 */
 function generateMermaidGraph(dirPath, parentId = 'root', depth = 0) {
    let graph = '';
    const items = fs.readdirSync(dirPath);
  
    items.forEach((item, index) => {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      const nodeId = `n${depth}_${index}`;
  
      // Ajouter le nœud au graphique
      graph += `${parentId} --> ${nodeId}(${item})\n`;
  
      // Si l'élément est un dossier, ajouter récursivement ses enfants
      if (stats.isDirectory()) {
        graph += generateMermaidGraph(fullPath, nodeId, depth + 1);
      }
    });
  
    return graph;
  }
  
  function createCompleteReportWithMermaid() {
    const projectRoot = path.resolve(__dirname);
    const fullReport = createCompleteReport(); // Utilisez la fonction existante pour créer le rapport complet
  
    // Générer le graphique Mermaid
    const mermaidGraph = `graph TD;\n${generateMermaidGraph(projectRoot)}`;
  
    // Écrire les rapports dans des fichiers
    fs.writeFileSync(path.join(__dirname, 'full-project-report.txt'), fullReport, 'utf8');
    fs.writeFileSync(path.join(__dirname, 'project-structure-mermaid.txt'), mermaidGraph, 'utf8');
  
    console.log('Full project report and Mermaid graph saved.');
  }
  
  createCompleteReportWithMermaid();