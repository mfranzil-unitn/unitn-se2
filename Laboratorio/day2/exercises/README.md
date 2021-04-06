# Exercises

1. **Implement html-elements-freq.js**, which returns a frequency table of the different tag elements in a page. The script should comply with the scheme:

```shell
$ node html-elements-freq.js <file with target html elements> <URL to a webpage>
```

The first parameters contains a list of the HTML elements we want to report (one per line):

```shell
$ cat html-elements.txt
<html>
<head>
<div>
<input>
```

And the second parameter is the webpage we want to explore. So an example invocation to this script is as follows:

```shell
$ node html-elements-freq.js ./html-elements.txt https://google.com
Webpage: https://google.com

 HTML Element     Frequency  
 <html>           1      
 <body>           1
 ....       
```

Remember, don't go too sequential ;)