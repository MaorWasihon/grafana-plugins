plugin_id=$(cat dist/plugin.json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
echo "Plugin ID: $plugin_id"
cp -r dist $plugin_id
zip -r ${plugin_id}.zip $plugin_id
rm -rf $plugin_id