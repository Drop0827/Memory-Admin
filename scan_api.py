# -*- coding: utf-8 -*-
import os
import re
import datetime

# Configuration
CONTROLLER_DIR = r"c:/Develop/Blog/Memory-Server/memory-blog/src/main/java/ohh/net/web/controller"
OUTPUT_FILE = r"c:/Develop/Blog/API_DOCUMENTATION.md"

def parse_java_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    filename = os.path.basename(file_path)
    module_name = filename.replace("Controller.java", "")
    base_path = ""
    endpoints = []

    # Regex patterns
    tag_pattern = re.compile(r'@Tag\s*\(\s*name\s*=\s*"(.*?)"')
    request_mapping_pattern = re.compile(r'@RequestMapping\s*\(\s*"(.*?)"\s*\)')
    
    # Method patterns
    method_mapping_pattern = re.compile(r'@(Get|Post|Put|Delete|Patch)Mapping')
    path_value_pattern = re.compile(r'"([^"]*)"')
    operation_pattern = re.compile(r'@Operation\s*\(\s*summary\s*=\s*"(.*?)"')
    no_token_pattern = re.compile(r'@NoTokenRequired')

    current_annotations = []
    
    for line in lines:
        line = line.strip()
        
        # Check for class definition
        if "public class" in line:
            for ann in current_annotations:
                tag_match = tag_pattern.search(ann)
                if tag_match:
                    module_name = tag_match.group(1)
                base_match = request_mapping_pattern.search(ann)
                if base_match:
                    base_path = base_match.group(1)
            current_annotations = []
            continue
            
        # Collect annotations
        if line.startswith("@"):
            current_annotations.append(line)
            continue

        # Check for method definition
        if "public " in line and "(" in line:
            http_method = None
            sub_path = ""
            summary = ""
            auth_required = True
            
            for ann in current_annotations:
                mapping_match = method_mapping_pattern.search(ann)
                if mapping_match:
                    http_method = mapping_match.group(1).upper()
                    path_match = path_value_pattern.search(ann)
                    if path_match:
                        sub_path = path_match.group(1)
                
                op_match = operation_pattern.search(ann)
                if op_match:
                    summary = op_match.group(1)
                    
                if no_token_pattern.search(ann):
                    auth_required = False
            
            if http_method:
                full_path = (base_path + sub_path).replace("//", "/")
                endpoints.append({
                    "method": http_method,
                    "path": full_path,
                    "summary": summary,
                    "auth": "公开" if not auth_required else "私有"
                })
            
            current_annotations = []
            continue
            
        # Clear annotations
        if line and not line.startswith("//") and (line.endswith(";") or line.endswith("}")):
            current_annotations = []

    return module_name, filename, endpoints

def main():
    if not os.path.exists(CONTROLLER_DIR):
        print(f"Error: Directory not found - {CONTROLLER_DIR}")
        return

    print(f"Scanning directory: {CONTROLLER_DIR}")
    
    files = [f for f in os.listdir(CONTROLLER_DIR) if f.endswith("Controller.java")]
    valid_modules = []

    for file in files:
        full_path = os.path.join(CONTROLLER_DIR, file)
        try:
            name, filename, endpoints = parse_java_file(full_path)
            if endpoints:
                valid_modules.append({
                    "name": name,
                    "filename": filename,
                    "endpoints": endpoints
                })
        except Exception as e:
            print(f"Failed to parse {file}: {e}")

    # Generate Markdown
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(f"# 项目 API 接口文档\n\n")
            f.write(f"> 本文档由脚本自动扫描生成，包含后端所有可用接口。\n\n")
            f.write(f"**生成时间**: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"## 接口使用说明\n")
            f.write(f"- **基础地址 (Base URL)**: `http://localhost:8080` (依后端配置而定)\n")
            f.write(f"- **前端 (Client)**: 主要使用 `公开` 接口。\n")
            f.write(f"- **控制端 (Admin)**: 可使用所有接口，需携带 `Authorization` Token。\n\n")
            f.write(f"---\n\n")
            
            for module in valid_modules:
                f.write(f"## {module['name']} ({module['filename'].replace('.java', '')})\n\n")
                f.write(f"| 请求方式 | 接口路径 | 功能描述 | 权限 |\n")
                f.write(f"| :--- | :--- | :--- | :--- |\n")
                for ep in module['endpoints']:
                    method_icon = ""
                    if ep['method'] == 'GET': method_icon = "🔵 "
                    elif ep['method'] == 'POST': method_icon = "🟢 "
                    elif ep['method'] == 'DELETE': method_icon = "🔴 "
                    elif ep['method'] == 'PUT': method_icon = "🟠 "
                    
                    f.write(f"| **{method_icon}{ep['method']}** | `{ep['path']}` | {ep['summary']} | {ep['auth']} |\n")
                f.write("\n")
        print(f"Documentation generated at: {OUTPUT_FILE}")
    except Exception as e:
        print(f"Failed to write output file: {e}")

if __name__ == "__main__":
    main()
